import boto3
import uuid
import json

dynamodb = boto3.resource('dynamodb')
teams_table = dynamodb.Table('teams')

def create_team(event, context):
    try:
        # Check if the team_name already exists
        response = teams_table.scan(
            FilterExpression='team_name = :team_name_val',
            ExpressionAttributeValues={':team_name_val': event['team_name']}
        )

        # If team_name already exists, return a 400 error
        if 'Items' in response and len(response['Items']) > 0:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Team name already exists'})
            }
        
        members = event["user_id"]
        members.append(event['team_admin'])

        team_id = str(uuid.uuid4().hex)

        teams_table.put_item(Item={
            'team_id': team_id,
            'team_admin': event['team_admin'],
            'team_name': event['team_name'],
            'members': members,
            'statistics': {'games_played': 0, 'wins': 0, 'losses': 0, 'points': 0}
        })

        response = {
            'statusCode': 200,
            'body': json.dumps({'team_id': team_id, 'team_name': event['team_name']})
        }

        return response

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal server error', 'details': str(e)})
        }

