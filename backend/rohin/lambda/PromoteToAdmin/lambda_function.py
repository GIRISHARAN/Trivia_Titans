import boto3
import json

dynamodb = boto3.resource('dynamodb')
teams_table = dynamodb.Table('teams')

def promote_admin(event, context):
    try:
        team_id = event['team_id']
        user_id = event['user_id']
        new_admin_id = event['member_id']

        team = teams_table.get_item(Key={'team_id': team_id})['Item']

        if not team:
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'Team not found!'})
            }

        if team['team_admin'] != user_id:
            return {
                'statusCode': 403,
                'body': json.dumps({'message': 'You do not have permission to promote members.'})
            }

        team['team_admin'] = new_admin_id
        teams_table.put_item(Item=team)

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'User promoted to admin successfully.'}),
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal Server Error'})
        }
