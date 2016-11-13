cp -r site/* dist/
cd dist; git add -A && git commit -a -m "deploy" && git push; cd ..
