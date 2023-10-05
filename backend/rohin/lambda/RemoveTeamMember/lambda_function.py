import boto3
import json

dynamodb = boto3.resource('dynamodb')
teams_table = dynamodb.Table('teams')

def remove_member(event, context):
    try:
        team_id = event['team_id']
        user_id = event['user_id']
        member_id = event['member_id']

        team = teams_table.get_item(Key={'team_id': team_id})['Item']

        if not team:
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'Team not found!'})
            }

        if team['team_admin'] != user_id:
            return {
                'statusCode': 403,
                'body': json.dumps({'message': 'You do not have permission to remove members.'})
            }

        if member_id == user_id:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'You cannot remove yourself from the team without promoting another person to be the admin.'})
            }

        if member_id in team['members']:
            team['members'].remove(member_id)
        else:
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'Member not Found!'})
            }

        teams_table.put_item(Item=team)

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'User removed from the team.'})
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal Server Error'})
        }

