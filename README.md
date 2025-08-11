# <i class="fa-brands fa-github fa-spin"></i>Stats SVG<i class="fa-solid fa-chart-line fa-fade"></i>
*A highly customizable stats SVG generator*

![UI Preview](ui.png)

This project generates a visually appealing, highly customizable SVG image displaying GitHub user statistics. It's designed to be embedded in GitHub profiles or other web pages to showcase a user's GitHub activity and contributions.

## 🚀 Try It Out!

Want to see your GitHub stats? Open the below link and Enter your username to generate your personalized stats SVG!

[Stats-SVG](https://git-stats.harikrishnan.tech/tryout)
```
https://git-stats.harikrishnan.tech/tryout
```

### 📋 Quick Template for Your Profile

Once you've tested your stats, add this to your GitHub profile README:

```markdown
![GitHub Stats](https://stats-svg-steel.vercel.app/api/github-status?username=YOUR_USERNAME)
```

**Replace `YOUR_USERNAME` with your actual GitHub username**

### 🎯 Example Usage

Here's how it looks with a real username:

![GitHub Stats SVG](https://stats-svg-steel.vercel.app/api/github-status?username=hk151109)

## ✨ Features

- 📊 **Real-time Data**: Fetches live GitHub user data using the GitHub GraphQL API
- 🎨 **Highly Customizable**: Generate SVG images with custom color schemes, configurations, and animated elements
- 📈 **Comprehensive Metrics**: Displays commits, language usage, repositories, stars, and more
- 🔄 **Consistent Algorithm**: Uses the same ranking and language calculation algorithm as [anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats) for standardized results
- ⚡ **Fast & Lightweight**: Optimized SVG generation for quick loading
- 🌈 **Multiple Themes**: Support for various color themes and styles

## 🛠️ Deployment

Since the GitHub API only allows 5k requests per hour, the public API provided by this repo could possibly hit the rate limiter. You can host your own instance of this repo on Vercel to avoid rate limiting issues.

> [!IMPORTANT]
> This project requires a GitHub Personal Access Token (PAT) to access private repositories. Refer to the Manual Deployment section below for instructions on obtaining the PAT.

<details>
<summary><b>🚀 Manual Deployment</b></summary>

### 1. Fork and Prepare the Repository
1. **Fork this repository** to your GitHub account
2. **[Create a Personal Access Token (PAT)](https://github.com/settings/tokens/new)**
   - Set the token name (e.g., "stats-svg")
   - Select scopes: `repo` and `user`
   - Copy the generated token (you won't see it again so save it!)

### 2. Deploy to Vercel
1. Visit [Vercel](https://vercel.com/)
2. Sign up/Log in with your GitHub account
3. From your Vercel dashboard:
   - Click `Add New...` → `Project`
   - Select the forked repository
   - Click `Import`

### 3. Configure Environment Variables
1. In the project configuration screen:
   - Expand the `Environment Variables` section
   - Add a new variable:
     - **Name**: `GITHUB_TOKEN`
     - **Value**: Your GitHub PAT from step 1
2. Click `Deploy`

### 4. Using Your Instance
- Once deployed, Vercel will provide you with a domain (e.g., `your-project.vercel.app`)
- You can use your instance by replacing the domain in the API URL:
  ```
  https://your-project.vercel.app/api/github-status?username=YOUR_GITHUB_USERNAME
  ```

### 🔧 Troubleshooting
- For deployment issues, check Vercel's deployment logs
- For bugs or feature requests, open an issue in this repository
- Ensure your GitHub token has the correct permissions

</details>

## 🎨 Customization Options

You can customize the appearance of the SVG by modifying query parameters of the `config.js` file.

## 🌟 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.
