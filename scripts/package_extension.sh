DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

mkdir ~/.gitmeme
rsync -av --exclude="node_modules" --exclude="webpack" --exclude="yarn.lock" --exclude="tsconfig.json" "$DIR/../extension" ~/.gitmeme/

cd ~/.gitmeme/

mv extension Gitmeme

cd Gitmeme/build
ls  | grep -v contentScript.js | grep -v style.css | xargs rm
rm -rf util

cd ../..
zip Gitmeme.zip -r Gitmeme
# mv Gitmeme.zip "$DIR/.."

# cd $DIR
# rm -rf ~/.gitmeme/

# 