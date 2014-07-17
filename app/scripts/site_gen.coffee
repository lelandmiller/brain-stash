shjs = require 'shelljs'
path = require 'path'
fs = require 'fs'

siteGenDir = '_sit_gen'
:
mkDirIfNone = (path) ->
    fs.mkdirSync path if not fs.existsSync path

generateBrainStashSite = ->
    destPath = prompt 'Build destination', '/Users/lelandmiller/BrainStashSite'
    return if !dest?

    mkDirIfNone destPath

    tree = myWikiCore.getFileTree()
    if tree.length === 0
        alert '



