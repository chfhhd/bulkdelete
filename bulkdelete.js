#!/usr/bin/env node

const { Octokit, App, Action } = require('octokit');
const readline = require('readline');
const application = require('commander')
const config = require('./config.json')

application
    .version('1.0.2')
    .name('bulkdelete')
    .description('Quickly search and delete multiple GitHub repositories by name')
    .requiredOption('-t,--token <your GitHub access token>', 'your GitHub access token', config.GITHUB_TOKEN)
    .requiredOption('-q,--query <query string>', 'GitHub API query string to search for the specific item')
    .option('-o,--org <your GitHub organization name>', 'your GitHub organization name', config.GITHUB_ORG)
    .option('-f,--force', 'delete repositories without user reconfirmation')
    .parse(process.argv)

const { token, org, query, force } = application.opts()

const octokit = new Octokit({ auth: token })

main()

async function main() {
    let queryString = encodeURIComponent(`${query}`)
    if (org !== '')
        queryString += `+org:${org}`

    let repositories = await findRepositories(queryString)
        .catch((error) => {
            console.log(error)
            process.exit()
        })

    if (repositories.size == 0) {
        return console.log("... no repositories found")
    }

    let deleteNow = false
    if (force)
        deleteNow = true
    else
        deleteNow = await promptUser(repositories)

    if (deleteNow) {
        for (let repo of repositories) {
            try {
                await octokit.request(`DELETE /repos/${repo}`)
                console.log(`... ${repo} deleted!`)
            } catch (error) {
                console.log(error)
            }
        }
    }

    process.exit()
}

async function promptUser(repositories) {
    console.log(`... ready to delete ${repositories.size} repositories (y/N)?`)

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    return new Promise(resolve => {
        process.stdin.on('keypress', (letter, key) => {
            if (key.ctrl && (key.name === 'c' || key.name === 'd'))
                process.exit();

            if (key.name === 'y') {
                resolve(true)
            }

            resolve(false)
        })
    })
}

async function deleteRepository(repositories) {
    console.log(`${repositories.size} repositories deleted!`)
}

async function findRepositories(queryString, log = true) {
    const repositories = new Set()

    const result = await octokit.request('GET /search/repositories', {
        q: queryString,
        per_page: 100
    })

    Object.entries(result.data.items).forEach((entry) => {
        const [key, value] = entry;
        repositories.add(value.full_name)

        if (log)
            console.log(value.full_name)
    })

    return repositories
}
