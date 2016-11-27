import pkg from './package'

export default {
  title: 'Texy',
  resolve: true,
  template: 'index.html',
  vendor: ['vue'].concat(Object.keys(pkg.dependencies))
}
