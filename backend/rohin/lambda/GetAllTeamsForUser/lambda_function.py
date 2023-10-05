import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('teams')

def get_teams(event, context):
    try:
        username = event['username']

        if not username:
            return {
                'statusCode': 400,
                'body': {'message': 'Username is required'}
            }

        response = table.scan(
            FilterExpression="contains(members, :username) OR team_admin = :username",
            ExpressionAttributeValues={
                ":username": username
            }
        )

        if 'Items' in response and response['Items']:
            teams = [{'id': item['team_id'], 'name': item['team_name']} for item in response['Items']]
            return {
                'statusCode': 200,
                'body': {'teams': teams}
                }
        else:
            return {
                'statusCode': 404,
                'body': {'message': 'No Teams Found'}
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': {'message': "Internal Error"}
        }
