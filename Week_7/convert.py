#!/Users/matthewwhite/opt/anaconda3/bin/python3

import re
import json

# simple script to convert Javascript object to JSON

# Function to convert tweet.js to tweets.json
def convert_js_to_json(js_file_path, json_file_path):
    try:
        # Read the contents of the JS file
        with open(js_file_path, 'r') as js_file:
            content = js_file.read()

            # Use regex to extract JSON data from the JS file
            # This assumes the JS file has the format 'something = [JSON DATA];'
            match = re.search('(\[.*\])', content, re.DOTALL)
            if match:
                json_data = match.group(1)

                # Write the JSON data to a new file
                with open(json_file_path, 'w') as json_file:
                    json_file.write(json_data)
                print(f"Data successfully written to {json_file_path}")

            else:
                print("Could not find JSON data in the JS file.")

    except FileNotFoundError:
        print(f"The file {js_file_path} was not found.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# Main function to execute the conversion
def main():
    js_file_path = 'tweet.js'
    json_file_path = 'tweets.json'
    convert_js_to_json(js_file_path, json_file_path)

if __name__ == "__main__":
    main(),
