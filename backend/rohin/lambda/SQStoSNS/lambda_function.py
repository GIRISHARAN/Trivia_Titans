import boto3
import json

# Initialize the clients
sqs_client = boto3.client('sqs')
sns_client = boto3.client('sns')

SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:586978264447:InvitesSNS'

def lambda_handler(event, context):
    for record in event['Records']:
        body = json.loads(record['body'])
        email_attribute = record['messageAttributes']['email']['stringValue']
        
        response = sns_client.publish(
            TopicArn=SNS_TOPIC_ARN,
            Subject=body['subject'],
            Message=body['message'],
            MessageAttributes={
                'email': {
                    'DataType': 'String',
                    'StringValue': email_attribute
                }
            }
        )
        
    return {
        'statusCode': 200,
        'body': json.dumps('Messages processed.')
    }
