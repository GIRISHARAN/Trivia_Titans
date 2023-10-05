# Import the required library
from google.cloud import firestore

# Define the Cloud Function that will be triggered by an HTTP request
def hello_http(request):
    # Initialize Firestore client
    db = firestore.Client()

    # Reference to the "userScores" collection in Firestore
    collection_ref = db.collection("userScores")

    # Query all documents in the "userScores" collection
    docs = collection_ref.stream()

    # Initialize a set to store unique game_ids
    unique_game_ids = set()

    # Loop through the documents and collect unique game_ids
    for doc in docs:
        # Get the value of the "game_id" field from the current document
        game_id = doc.get("game_id")
        # Check if the "game_id" field exists in the document and is not None
        if game_id:
            # Add the game_id to the set to ensure uniqueness
            unique_game_ids.add(game_id)

    # Convert the set to a list (if needed) and prepare the JSON response
    response = {
        "unique_game_ids": list(unique_game_ids)
    }

    # Return the JSON response, which contains the list of unique game_ids
    return response
