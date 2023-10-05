import boto3
import json

dynamodb = boto3.resource('dynamodb')
teams_table = dynamodb.Table('teams')


def leave_team(event, context):
    team_id = event['team_id']
    user_id = event['user_id']

    team = teams_table.get_item(Key={'team_id': team_id})['Item']

    if team['team_admin'] == user_id:
        return {
            'statusCode': 403,
            'body': json.dumps({'message': 'The team admin cannot leave the team. Please promote another member to admin'})
        }

    if user_id in team['members']:
        team['members'].remove(user_id)
    else:
        return {
            'statusCode': 404,
            'body': json.dumps({'message': 'Member not Found!'})
        }

    teams_table.put_item(Item=team)

    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'You have left the team.'}),
    }
    