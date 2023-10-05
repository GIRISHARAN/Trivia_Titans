import boto3

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    quizzes_table = dynamodb.Table('Quizzes')

    try:
        # Perform a scan operation to retrieve all items in the "Quizzes" table
        response = quizzes_table.scan()

        # Extract the desired fields from the scanned items
        quizzes = [
            {
                'quizNumber': item['quizNumber'],
                'quizCategory': item['quizCategory'],
                'quizLevel': item['quizLevel'],
                'timeLimit': item['timeLimit'],
                'quizExpiry': item['quizExpiry'],
                'quizName': item['quizName'],
                'quizDescription': item['quizDescription']
            }
            for item in response['Items']
        ]

        # Return the quiz data
        return {
            'statusCode': 200,
            'body': quizzes
        }

    except Exception as e:
        # Return a 500 error if an exception occurs
        return {
            'statusCode': 500,
            'body': 'An error occurred: {}'.format(str(e))
        }
