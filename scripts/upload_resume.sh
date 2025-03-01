


# Load environment variables
if [ -f .env ]; then
    source ./.env
else
    echo ".env file not found!"
    exit 1
fi


# Get the json file
resume_json=$(cat ./temp/resume.json)

# Upload to an existing gist using gh
# https://cli.github.com/manual/gh_gist_edit

gh gist edit $GIST_ID ./temp/resume.json

echo "Resume uploaded to gist $GIST_ID"
