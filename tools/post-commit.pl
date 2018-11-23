#!/usr/bin/perl -w

# This script is called by the GIT server whenever something is pushed
# the the 'master' branch. It will get a list of the files that have
# changed.

print "post-update.pl started\n";

chdir("/mnt/data/httpd/html/projects/vacationblog");
# Get the updates from git
system("GIT_DIR=.git; git pull");
$do_rebuild = 0;
while ($arg = shift) {
    if ($arg =~ /^src\//) {
        # Need to re-build React app
        $do_rebuild = 1;
    }
}

if ($do_rebuild) {
  system("npm run browserify");
}
print "post-update.pl done\n";
