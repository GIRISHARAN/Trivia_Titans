import boto3
import json
from urllib.parse import unquote

# Initialize the DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('teams')

def decline_invite(event, context):
    try:
        # Extract team_name and username from the URL
        team_name = unquote(event['queryStringParameters']['team_name'])
        username = event['queryStringParameters']['username']

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

        # Remove username from the members list if they are a member
        if username in current_members:
            current_members.remove(username)

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
                'body': json.dumps({"success": True, "message": f'{username} has left the team {team_name}.'})
            }
        else:
            return {
                'statusCode': 200,
                'body': json.dumps({"success": True, "message": f'{username} has declined invitation to join the team {team_name}.'})
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({"success": False, "message": str(e)})
        }