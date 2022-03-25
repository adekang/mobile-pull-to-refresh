 #!/usr/bin/env sh

rm -rf dist &&
yarn build:h5 &&
cd dist &&
git init &&
git add . &&
git commit -m "update" &&
git branch -M gh-pages &&
git push -f git@github.com:adekang/mobile-pull-to-refresh.git gh-pages &&
cd -
