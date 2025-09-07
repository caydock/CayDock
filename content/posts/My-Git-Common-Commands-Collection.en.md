---
title: "My Git Common Commands Collection"
date: 2015-10-11 15:52:30
draft: false
language: en
---

Git version control (GitHub) plays a very important role in my actual development process, making the development process more efficient. Through Git, you can record every change in the project's code and "travel through time" to return to any past state. In development, I mainly use Git command line to commit each change and clone online projects. I feel that Git commands are very important, so today I'll summarize some Git commands I usually use.

* Clone a project from an existing repository to your workspace
``` bash
$ git clone [url]
```
* To determine which files are currently in what state:
``` bash
$ git status
``` 
* Track new files, to track the README file, run:
``` bash
$ git add README
```
* Track all files:
``` bash
$ git add --all
```
* Commit updates, after the git add command, you need to run the commit command:
``` bash
$ git commit -m "Add information about this commit here"
```
* First commit modified files to stage, then commit from stage to branch:
``` bash
$ git commit -a 
``` 
* Combine git add and git commit commands, but this command is not suitable for new files (files that have not been added):
``` bash
$ git commit -am "Add information about this commit here"
```
* View and compare modified content:
``` bash
$ git diff <filename>
```
* View commit history:
``` bash
$ git log
```
* Create a branch named branchName:
``` bash
$ git branch branchName 
```
* Discard changes in working directory and index, HEAD pointer still points to current commit:
``` bash
$ git reset --hard HEAD 
```
Roll back to the previous version (equivalent to git reset --hard HEAD~1)
``` bash
$ git reset --hard HEAD^ 
```
* Roll back to the specified version number state
``` bash
$ git reset --hard 20038
```
* Merge the specified branch into the current branch (using fast forward by default):
``` bash
$ git merge <branch>
```
* Delete branch:
``` bash
$ git branch -d <branch>
```
* Fetch the latest version from remote to local repository and automatically merge to local branch:
``` bash
$ git pull origin master
```
* Discard all your local changes and commits, you can get the latest version from the server and point your local main branch to it:
``` bash
$ git fetch origin
```
		
The above are the common Git commands that can complete most version control tasks. I haven't been in contact with Git for too long, and I haven't fully understood Git commands and processes yet. I'm only at the level of being able to use them. This summary is a consolidation, hoping to understand Git this magical tool more deeply in the future.
>My GitHub account [https://github.com/w3cay](https://github.com/w3cay)
