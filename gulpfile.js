const gulp = require('gulp')
const babel = require('gulp-babel')
const nodemon = require('gulp-nodemon')
const del = require('del')
const uglify = require('gulp-uglify')
const pipeline = require('readable-stream').pipeline
const htmlmin = require('gulp-htmlmin')

const isProd = process.env.NODE_ENV === 'production'

gulp.task('clean', () => del(['dist/server', 'dist/static']))

gulp.task('server', () => {
  const babelPipe = gulp.src(['src/server/**/*', '!src/server/**/*.html']).pipe(
    babel({
      presets: ['@babel/env']
    })
  )
  const destPipe = gulp.dest('dist/server')

  return isProd ? pipeline(babelPipe, uglify(), destPipe) : pipeline(babelPipe, destPipe)
})

gulp.task('html', () => {
  const srcPipe = gulp.src(['src/server/**/*.html'])
  const minPipe = htmlmin({
    removeComments: true,
    removeAttributeQuotes: true,
    ignoreCustomComments: [/vue-ssr-outlet/],
    collapseWhitespace: true
  })
  const destPipe = gulp.dest('dist/server')

  return isProd ? pipeline(srcPipe, minPipe, destPipe) : pipeline(srcPipe, destPipe)
})

gulp.task('static', () => gulp.src(['src/static/**/*']).pipe(gulp.dest('dist/static')))

gulp.task('compile', gulp.parallel(['server', 'html', 'static']))

gulp.task('nodemon', done => {
  return nodemon({
    script: 'dist/server/server.js',
    tasks: ['compile'],
    watch: ['src'],
    env: { NODE_ENV: 'development' },
    done
  })
})

gulp.task('default', gulp.series(['clean', 'compile', 'nodemon']))

gulp.task('build', gulp.series(['clean', 'compile']))
