# Common Git Workflow Steps

1. The main person creates the project folder and initial files.
2. Push the project to GitHub.
3. Add team members as collaborators.
4. All team members clone the repository.
5. **[VERY IMPORTANT]** Each member creates their own branch.
6. Write code only in your own branch.
7. After completing your work, commit and push your changes.
8. Inform teammates about the commit.
9. The person responsible for merging fetches the latest changes and merges them into the `main` branch.

## Branch Naming Convention

- feature/frontend-login
- feature/frontend-register
- feature/frontend-homepage

- feature/backend-auth
- feature/backend-products
- feature/backend-orders

- feature/admin-dashboard
- feature/payment-module

## Rules

- Never push directly to the `main` branch.
- Always pull the latest changes before starting work.
- Use meaningful commit messages.
- Test your code before pushing.
- Inform the team after every major commit.

## Example Commands

### Clone Repository

```bash
git clone https://github.com/your-org/project-name.git
cd project-name
```

### Create Branch and Swith

```bash
git switch -c "branch name"
```

### Check Current Branch

```bash
git branch
```

### Add Changes

```bash
git add .
```

### Commit Changes

```bash
git commit -m "Added login page UI"
```

### Push Branch

```bash
git push origin branch-name
```

### Get Latest Changes

```bash
git pull origin main
```

### Merge Branch into Main

```bash
git checkout main
git pull origin main
git merge branch-name
git push origin main
```