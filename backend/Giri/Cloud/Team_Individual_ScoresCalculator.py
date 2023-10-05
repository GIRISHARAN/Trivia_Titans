from flask import jsonify
from google.cloud import firestore
import json
import uuid

def fetch_team_data():
    # Initialize Firestore client
    db = firestore.Client()

    # Reference to the 'teamScores' collection
    team_scores_ref = db.collection('teamScores')

    # Fetch all team documents from 'teamScores' collection and store in a dictionary (map)
    team_data_map = {}
    for doc in team_scores_ref.stream():
        doc_data = doc.to_dict()
        team_id = doc_data.get('team_id')
        team_name = doc_data.get('team_name')
        if team_id and team_name:
            team_data_map[team_id] = team_name

    return team_data_map

def hello_http(request):
    # Parse the request JSON data
    request_data = request.get_json()
    if not request_data or 'quiz_id' not in request_data:
        return json.dumps({"error": "Invalid request. 'quiz_id' parameter is missing."}), 400

    # Get the 'quiz_id' parameter from the request
    quiz_id = request_data['quiz_id']

    # Initialize Firestore client
    db = firestore.Client()

    # Reference to the 'userScores' collection
    user_scores_ref = db.collection('userScores')

    # Query to get the documents with the given 'quiz_id'
    query = user_scores_ref.where('game_id', '==', quiz_id).get()

    # Initialize a dictionary to store the results
    teams_points = {}
    persons_points = {}

    # Fetch team data
    team_data_map = fetch_team_data()

    # Process each document returned by the query
    for doc in query:
        doc_data = doc.to_dict()

        # Segregate based on 'team_id'
        team_id = doc_data.get('team_id')
        if team_id:
            if team_id not in teams_points:
                teams_points[team_id] = 0

            # Calculate total points of each team
            teams_points[team_id] += doc_data.get('points', 0)

            # Store points for each person (user) within each team
            user_id = doc_data.get('user_id')
            user_name = doc_data.get('user_name')
            user_points = doc_data.get('points', 0)

            if user_id:
                # Generate a random document ID for each user
                user_doc_id = str(uuid.uuid4())

                # Create a dictionary for the user data
                user_doc = {
                    'team_id': team_id,
                    'user_id': user_id,
                    'user_name': user_name,
                    'points': user_points
                }

                # Add the user data to the persons_points dictionary
                persons_points[user_doc_id] = user_doc

    # Delete all documents in the 'teams_points' collection
    teams_points_collection_ref = db.collection('teams_points')
    delete_all_docs(teams_points_collection_ref)

    # Use a new Firestore client instance to refresh the cache (Approach 1)
    db = firestore.Client()

    # Create or update the 'teams_points' collection with separate documents for each team
    for team_id, total_points in teams_points.items():
        # Generate a random document ID for each team
        team_doc_id = str(uuid.uuid4())
        team_name = team_data_map.get(team_id, '')
        team_doc = {
            "team_id": team_id,
            "team_name": team_name,
            "total_points": total_points,
        }
        teams_points_collection_ref.document(team_doc_id).set(team_doc)

    # Use the fetch operation to refresh cache (Approach 2)
    teams_points_collection_ref.get()

    # Create or update the 'persons_points' collection with the provided 'quiz_id'
    persons_points_collection_ref = db.collection('persons_points')

    # Delete all existing documents in the 'persons_points' collection without caching
    delete_all_docs(persons_points_collection_ref)

    # Create separate documents for each user in the 'persons_points' collection
    for user_doc_id, user_data in persons_points.items():
        persons_points_collection_ref.document(user_doc_id).set(user_data)

    result = {
        "quiz_id": quiz_id,
        "teams_points": teams_points,
        "persons_points": persons_points
    }

    return json.dumps(result), 200

def delete_all_docs(collection_ref):
    # Delete all documents in the given collection without caching
    docs = collection_ref.get()
    for doc in docs:
        doc.reference.delete()
