import boto3
import json
import time
import logging
from urllib.parse import quote_plus

sns_client = boto3.client('sns')
sqs_client = boto3.client('sqs')

SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:586978264447:InvitesSNS'
SQS_QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/586978264447/InvitesQueue'
ACCEPT_URL = 'https://scwmimxeql.execute-api.us-east-1.amazonaws.com/dev/invites/accept-invite'
DECLINE_URL = 'https://scwmimxeql.execute-api.us-east-1.amazonaws.com/dev/invites/decline-invite'

def get_subscription_arn(email, topic_arn):
    response = sns_client.list_subscriptions_by_topic(TopicArn=topic_arn)
    for subscription in response['Subscriptions']:
        if subscription['Protocol'] == 'email' and subscription['Endpoint'] == email:
            return subscription['SubscriptionArn']
    return None

def set_subscription_filter(email, subscription_arn):
    filter_policy = {
        "email": [email]
    }
    sns_client.set_subscription_attributes(
        SubscriptionArn=subscription_arn,
        AttributeName='FilterPolicy',
        AttributeValue=json.dumps(filter_policy)
    )

def send_invite_to_sqs(team_name, email, accept_url, decline_url):
    message = {
    'subject': 'Invitation to Join Team',
    'message': f"\nYou are invited to join '{team_name}'.\n\n\
                Accept: \n{accept_url}\n\
                Decline: \n{decline_url}"
    }
    message_attributes = {
        'email': {
            'DataType': 'String',
            'StringValue': email
        }
    }
    sqs_client.send_message(
        QueueUrl=SQS_QUEUE_URL,
        MessageBody=json.dumps(message),
        MessageAttributes=message_attributes
    )

def lambda_handler(event, context):
    team_name = event['team_name']
    email = event['email']

    if not get_subscription_arn(email, SNS_TOPIC_ARN):
        sns_client.subscribe(
            TopicArn=SNS_TOPIC_ARN,
            Protocol='email',
            Endpoint=email
        )
        time.sleep(90) 

    subscription_arn = get_subscription_arn(email, SNS_TOPIC_ARN)

    if subscription_arn:
        team_name_encoded = quote_plus(team_name)
        username_encoded = quote_plus(event['username'])
        accept_url = ACCEPT_URL + "?team_name=" + team_name_encoded + "&username=" + username_encoded
        decline_url = DECLINE_URL + "?team_name=" + team_name_encoded + "&username=" + username_encoded
        set_subscription_filter(email, subscription_arn)
        send_invite_to_sqs(team_name, email, accept_url, decline_url)
        return {
            'statusCode': 200,
            'body': json.dumps('Request processed successfully!')
        }
    else:
        return {
            'statusCode': 400,
            'body': json.dumps('Subscription not accepted in time or could not find subscription ARN.')
        }
