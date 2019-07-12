import log4js from 'log4js'

const config = {
  level: 'all'
}

const appenders = {
  stdout: {
    type: 'stdout'
  }
}

const categories = {
  default: {
    appenders: ['stdout'],
    level: config.level
  }
}

const categoryFiles = ['render', 'app']
categoryFiles.forEach(name => {
  appenders[name] = {
    type: 'dateFile',
    level: 'all',
    filename: 'logs/' + name,
    pattern: 'yyyy-MM-dd.log',
    alwaysIncludePattern: true
  }

  categories[name] = {
    appenders: [name],
    level: config.level
  }
})

log4js.configure({
  appenders,
  categories
})

const logger = {}

categoryFiles.forEach(name => {
  logger[name] = log4js.getLogger(name)
})

export default logger
