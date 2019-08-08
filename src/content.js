import yaml from 'js-yaml'

console.log(
    yaml.safeDump({
        this: 'is a',
        95: 'test',
        a: ['8', 8],
    }),
)
