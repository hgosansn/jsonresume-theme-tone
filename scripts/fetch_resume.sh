

# Load environment variables
if [ -f .env ]; then
    source ./.env
else
    echo ".env file not found!"
    cp ./example.env ./.env
    echo "Created a .env file sample"
    echo "Please fill the .env file and run the script again"
    exit 1
fi

# Download a json Gist
resume_json=$(curl -s https://api.github.com/gists/$GIST_ID | jq -r '.files["resume.json"].content')

mkdir -p ./temp
echo $resume_json | tr -d '\000-\037' | jq -r '.' > ./temp/resume.json
echo "Resume downloaded to ./temp/resume.json"
