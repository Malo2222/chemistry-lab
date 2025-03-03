@echo off
echo Setting up GitHub repository for Chemistry Lab...
echo.

set /p github_username=Enter your GitHub username: 

echo.
echo Initializing git repository...
git init

echo.
echo Adding files to git...
git add .

echo.
echo Making initial commit...
git commit -m "Initial commit"

echo.
echo Renaming branch to main...
git branch -M main

echo.
echo Adding remote repository...
git remote add origin https://github.com/%github_username%/chemistry-lab.git

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo Setup complete!
echo.
echo Your site will be built automatically by GitHub Actions.
echo Once deployment is complete, your site will be available at:
echo https://%github_username%.github.io/chemistry-lab/
echo.
echo Remember to go to your repository settings on GitHub:
echo 1. Navigate to "Pages" in the left sidebar
echo 2. Under "Build and deployment", select Source: "GitHub Actions"
echo.
pause 