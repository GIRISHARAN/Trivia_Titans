import boto3
import json
from urllib.parse import unquote

# Initialize the DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('teams')

def accept_invite(event, context):
    try:
        # Extract team_name and username from the URL
        team_name = unquote(event['queryStringParameters']['team_name'])
        username = event['queryStringParameters']['username']

        # Scan for the team using team_name
        response = table.scan(
            FilterExpression="team_name = :team_name",
            ExpressionAttributeValues={
                ':team_name': team_name
            }
        )

        if not response['Items']:
            return {
                'statusCode': 400,
                'body': json.dumps({"message":'Team not found.'})
            }

        current_members = response['Items'][0].get('members', [])

        # Add username to the members list if not already a member
        if username not in current_members:
            current_members.append(username)

            # Assuming the primary key is 'team_id'.
            team_id = response['Items'][0]['team_id']

            # Update the members in the DynamoDB table
            table.update_item(
                Key={'team_id': team_id},
                UpdateExpression="set members = :m",
                ExpressionAttributeValues={
                    ':m': current_members
                }
            )

        return {
            'statusCode': 200,
            'body': json.dumps({"success": True, "message": f'{username} has accep invitation to join the team {team_name}.'})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({"success":False,"message":str(e)})
        }
