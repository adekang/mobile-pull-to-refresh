 #!/usr/bin/env sh

rm -rf dist &&
yarn build:h5 &&
cd dist &&
git init &&
git add . &&
git commit -m "update" &&
git branch -M master &&
git remote add origin git@github.com:adekang/mobile-pull-to-refresh-web.git &&
git push -f -u origin master &&
cd -
