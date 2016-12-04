#!/usr/bin/perl -w

use LWP::UserAgent;
use URI::Escape;
use Encode;
use utf8;

$gl_site = 'http://localhost/vacationblog/site';
#$gl_site = 'http://vacationblog-egrivel.rhcloud.com/site';

binmode(STDOUT, ":utf8");

my $gl_do_real = 0;

my %trip = ();
$trip{'tripId'} = 'vak2007';
$trip{'created'} = '2007-05-01 12:00:00';
$trip{'updated'} = $trip{'created'};
$trip{'name'} = 'Around the U.S. in 8 weeks';
$trip{'startDate'} = '2007-06-20';
$trip{'endDate'} = '2007-08-17';
$trip{'active'} = 'N';
$trip{'bannerImg'} = 'vak2007-banner.png';
$trip{'description'} = "In the summer of 2007, our family spent eight weeks traveling around the United States. Our trip took us over 15,000 miles (almost 25,000 kilometers), enough to drive more than halfway around the world. We visited 36 of the 48 contiguous United States (75%). The map below shows our route:\n\nmap\n\nOur journey started on Saturday, June 23 and we returned home on Friday, August 17. We regularly updated the website and exchanged comments with friends and family. Read about our exploits by clicking on the Trip Diary link, or enjoy a selection of the Photos.";
add_trip(\%trip);

%trip = ();
$trip{'tripId'} = 'vak2012';
$trip{'created'} = '2012-05-01 12:00:00';
$trip{'updated'} = $trip{'created'};
$trip{'name'} = 'I-70';
$trip{'startDate'} = '2012-09-01';
$trip{'endDate'} = '2012-09-30';
$trip{'active'} = 'N';
$trip{'bannerImg'} = 'vak2012-banner.png';
$trip{'description'} = "We are dedicating the year 2012 as the year of I-70. The plan is to explore the entire almost 2200 miles of Interstate 70, in a number of trips.\n\nEver since the Maryland Highway Administration placed a sign close to the start of westbound I-70 with the tantalizing text Columbus 420 — St Louis 845 — Denver 1700 — Cove Fort 2200 we have been wanting to go to the other end of this Interstate. Over the winter we decided that this year is going to be the year. We will be reading books about I-70, but also about places and events surrounding it. We expect to make several I-70 related day trips, a one-week vacation in the spring to explore the first part (Pennsylvania through Ohio), and finally “the big one,” where we will be spending most of the month of September along the I-70.\n\nJust like we did with our 2007 trip around the United States we are creating a website were we will be blogging about our progress and our impressions. Links to our respective diaries are at the top.\n\nWe are also planning to write “essays” about what we discover and experience. These essays will a little bit more in-depth than the diary entries and include references to additional information.\n\nWe hope that our friends will again join us on this adventure, and maybe we will all learn a little bit about America...";
add_trip(\%trip);

%trip = ();
$trip{'tripId'} = 'vak2013'; # '2013-maine';
$trip{'created'} = '2013-05-01 12:00:00';
$trip{'updated'} = $trip{'created'};
$trip{'name'} = 'Maine';
$trip{'startDate'} = '2013-09-01';
$trip{'endDate'} = '2013-09-30';
$trip{'active'} = 'N';
$trip{'bannerImg'} = 'vak2013-banner.png';
$trip{'description'} = "This is the website for our 2013 vacation, where we will be traveling up the eastcoast and visit the state of Maine for the first time.\n\nJust like we did with our 2007 trip around the United States and our 2012 I-70 trip, we are creating a website were we will be blogging about our progress and our impressions. Links to our respective diaries are at the top.\n\nWe hope that our friends will again join us on this adventure, and maybe we will all learn a little bit about America...";
add_trip(\%trip);

%trip = ();
$trip{'tripId'} = 'vak2014'; # '2014-europe';
$trip{'created'} = '2014-05-01 12:00:00';
$trip{'updated'} = $trip{'created'};
$trip{'name'} = 'Europe';
$trip{'startDate'} = '2014-09-01';
$trip{'endDate'} = '2014-09-30';
$trip{'active'} = 'N';
$trip{'bannerImg'} = 'vak2014-banner.png';
$trip{'description'} = "This is the website for our 2014 vacation, where we will be traveling to Ireland, England, Belgium and Holland.\n\nJust like we did with our previous trips, we are creating a website were we will be blogging about our progress and our impressions. Links to our respective diaries are at the top.\n\nWe hope that our friends will again join us on this adventure, and maybe we will all learn a little bit about Europe...";
add_trip(\%trip);

%trip = ();
$trip{'tripId'} = 'vak2015'; # '2015-oklahoma';
$trip{'created'} = '2015-05-01 12:00:00';
$trip{'updated'} = $trip{'created'};
$trip{'name'} = 'Oklahoma';
$trip{'startDate'} = '2015-09-01';
$trip{'endDate'} = '2015-09-30';
$trip{'active'} = 'N';
$trip{'bannerImg'} = 'vak2015-banner.png';
$trip{'description'} = "This is the website for our 2015 vacation, where traveled to Alabama, Arkansas and Oklahoma (and various other states on the way). The map below shows our route; click on the map for an interactive version where you can zoom in for details (opens in a new window).";
add_trip(\%trip);

sub getTripId {
    my $tripId = $_[0];

    if ($tripId eq "'2013-maine'") {
        $tripId = "'vak2013'";
    } elsif ($tripId eq "'2014-europe'") {
        $tripId = "'vak2014'";
    } elsif ($tripId eq "'2015-oklahoma'") {
        $tripId = "'vak2015'";
    }
    return $tripId;
}

sub getProfileImg {
    my $tripId = $_[0];
    my $userId = $_[1];

    $tripId =~ s/\'//g;
    $userId =~ s/\'//g;

    return "'$tripId-$userId.jpg'";
}

# Note: modified to support various encoding sequences in the grivelne database,
# the the other ones.
process('data.sql');

sub process {
    my $fname = $_[0];

    open(FILE, "<$fname") || die "Cannot read $fname\n";
    while (<FILE>) {
        next if (/^\s*$/);
        next if (/^--\s/s);  # comments
        next if (/^\/\*/);   # comments
        next if (/^DROP TABLE /);
        next if (/^CREATE TABLE /);
        next if (/^  /); # continuation line in create table
        next if (/^\) ENGINE=/); # end of create table
        next if (/^LOCK TABLES /);
        next if (/^UNLOCK TABLES;/);

        if (s/^INSERT INTO \`([\w_]+)\` (\(\`[^\)]*\`\) )?VALUES //) {
            my $table = $1;
            while (s/^\(//) {
                my @value = ();
                my $count = 0;
                while (! (s/^\),?//)) {
                    if (s/^(\'[^\']*\'),?//) {
                        $value[$count++] = $1;
                    } elsif (s/^(\d+),?//) {
                        $value[$count++] = $1;
                    } elsif (s/^(NULL),?//) {
                        $value[$count++] = $1;
                    } else {
                        print "Unrecognized '$_'\n";
                    }
                }
                if (($table eq "vak_comments")
                    || ($table eq "vak12_comments")
                    || ($table eq "vacations_comments")) {
                    my %comment = ();
                    my $nr = 0;
                    $comment{'counter'} = $value[$nr++];
                    if ($table eq "vak_comments") {
                        $comment{'tripId'} = 'vak2007';
                    } elsif ($table eq "vak12_comments") {
                        $comment{'tripId'} = 'vak2012';
                    } else {
                        $comment{'tripId'} = getTripId($value[$nr++]);
                    }
                    $comment{'commentId'} = $value[$nr++];
                    $comment{'type'} = $value[$nr++];
                    $comment{'referenceId'} = $value[$nr++];
                    $comment{'userId'} = $value[$nr++];
                    $comment{'title'} = $value[$nr++];
                    $comment{'commentText'} = $value[$nr++];
                    $comment{'updated'} = $value[$nr++];
                    $comment{'updatesystem'} = $value[$nr++];
                    $comment{'created'} = $value[$nr++];
                    $comment{'deleted'} = $value[$nr++];
                    if ($count != $nr) {
                        print "Expected $nr columns in vak_comments, got $count\n";
                    }
                    add_comment(\%comment);
                } elsif (($table eq "vak_items")
                    || ($table eq "vak12_items")
                    || ($table eq "vacations_items")) {
                    my %item = ();
                    my $nr = 0;
                    if ($table eq "vak_items") {
                        $item{'tripId'} = 'vak2007';
                    } elsif ($table eq "vak12_items") {
                        $item{'tripId'} = 'vak2012';
                    } else {
                        $item{'tripId'} = getTripId($value[$nr++]);
                    }
                    $item{'journalId'} = $value[$nr++];
                    $item{'userId'} = $value[$nr++];
                    $item{'journalDate'} = $value[$nr++];
                    $item{'journalTitle'} = $value[$nr++];
                    $item{'journalText'} = $value[$nr++];
                    $item{'updated'} = $value[$nr++];
                    $item{'updatesystem'} = $value[$nr++];
                    $item{'created'} = $value[$nr++];
                    $item{'deleted'} = $value[$nr++];
                    if ($count != $nr) {
                        print "Expected $nr columns in vak_items, got $count\n";
                    }
                    add_item(\%item);
                } elsif (($table eq 'vak_photos')
                         || ($table eq 'vak12_photos')
                         || ($table eq "vacations_photos")) {
                    my %photo = ();
                    my $nr = 0;
                    if ($table eq "vak_photos") {
                        $photo{'tripId'} = 'vak2007';
                    } elsif ($table eq "vak12_photos") {
                        $photo{'tripId'} = 'vak2012';
                    } else {
                        $photo{'tripId'} = getTripId($value[$nr++]);
                    }
                    $photo{'mediaId'} = $value[$nr++];
                    $photo{'type'} = 'photo';
                    $photo{'setid'} = $value[$nr++];
                    $photo{'title'} = $value[$nr++];
                    $photo{'caption'} = $value[$nr++];
                    $photo{'orientation'} = $value[$nr++];
                    if ($photo{'orientation'} =~ /portrait/) {
                        $photo{'width'} = 600;
                        $photo{'height'} = 900;
                    } else {
                        $photo{'width'} = 900;
                        $photo{'height'} = 600;
                    }
                    $photo{'updated'} = $value[$nr++];
                    $photo{'updatesystem'} = $value[$nr++];
                    $photo{'created'} = $value[$nr++];
                    $photo{'deleted'} = $value[$nr++];
                    if ($count != $nr) {
                        print "Expected $nr columns in vak_photos, got $count\n";
                    }
                    add_photo(\%photo);
                } elsif (($table eq 'vak_user')
                         || ($table eq 'vak12_user')
                         || ($table eq 'vacations_users')) {
                    my %user = ();
                    my $nr = 0;
                    $user{'userId'} = $value[$nr++];
                    $user{'name'} = $value[$nr++];
                    # Prefix the hash value from the old system with "$0$" to
                    # make it regocnizable as the "old" hash.
                    my $pwd = $value[$nr++];
                    $pwd =~ s/^\'//;
                    $pwd =~ s/\'$//;
                    $pwd = '$0$' . $pwd;
                    $user{'passwordHash'} = "'$pwd'";
                    $user{'email'} = $value[$nr++];
                    $user{'access'} = $value[$nr++];
                    $user{'tempCode'} = $value[$nr++];
                    if (($user{'access'} ne "temp")
                        && ($user{'access'} ne "'temp'")) {
                        $user{'tempCode'} = "''";
                    }
                    $user{'text'} = $value[$nr++];
                    if ($table eq 'vak_user') {
                        $user{'updated'} = $value[$nr++];
                        $user{'updatesystem'} = $value[$nr++];
                        $user{'deleted'} = $value[$nr++];
                        $user{'notification'} = $value[$nr++];
                    } else {
                        $user{'notification'} = $value[$nr++];
                        $user{'updated'} = $value[$nr++];
                        $user{'updatesystem'} = $value[$nr++];
                        $user{'deleted'} = $value[$nr++];
                    }
                    $user{'created'} = $user{'updated'};
                    if ($count != $nr) {
                        print "Expected $nr columns in vak_user, got $count\n";
                    }
                    if ($user{'notification'} =~ /yes/i) {
                        $user{'notification'} = 'Y';
                    } elsif ($user{'notification'} =~ /no/i) {
                        $user{'notification'} = 'N';
                    }
                    if (($user{'userId'} eq '\'katiekhadem\'')
                        && ($table eq 'vacations_users')) {
                        # fix duplicate key
                        $user{'updated'} =~ s/^\'2012/\'2013/;
                    }
                    $access = $user{'access'};
                    if ($user{'access'} eq '\'maint\'') {
                        # maintainers are visitors on the user level; they get
                        # added as a trip user below
                        $user{'access'} = '\'visitor\'';
                    }
                    add_user(\%user);
                    if (($access eq '\'maint\'')
                        || ($access eq '\'admin\'')) {
                        $user{'role'} = $access;
                        $user{'message'} = $user{'text'};
                        if ($table eq "vak_user") {
                            $user{'tripId'} = 'vak2007';
                            $user{'profileImg'} = getProfileImg($user{'tripId'}, $user{'userId'});
                            add_trip_user(\%user);
                        } elsif ($table eq "vak12_user") {
                            $user{'tripId'} = 'vak2012';
                            $user{'profileImg'} = getProfileImg($user{'tripId'}, $user{'userId'});
                            add_trip_user(\%user);
                        } else {
                            $user{'tripId'} = 'vak2013';
                            $user{'profileImg'} = getProfileImg($user{'tripId'}, $user{'userId'});
                            add_trip_user(\%user);
                            $user{'tripId'} = 'vak2014';
                            $user{'profileImg'} = getProfileImg($user{'tripId'}, $user{'userId'});
                            add_trip_user(\%user);
                            $user{'tripId'} = 'vak2015';
                            $user{'profileImg'} = getProfileImg($user{'tripId'}, $user{'userId'});
                            add_trip_user(\%user);
                        }
                    }
                } else {
                    print "Unknown table '$table'\n";
                }
                # add to output
            }
            s/^;\s*//s;
            if ($_ ne "") {
                print "Remainder '$_'\n";
            }
        } else {
            print "Unknown line '$_'\n";
        }
    }
    close FILE;
}

##
# Convert to single-line format, based on simplified 'markdown'
#
sub to_title {
    my $text = $_[0];

    $text =~ s/&amp;/&/g;

#    $text =~ s/&apos;/\x{2019}/g;
#    $text =~ s/&eacute;/\x{00e9}/g;
#    $text =~ s/&amp;eacute;/\x{00e9}/g;

    
    if ($text =~ /(\&\w+;)/) {
        print "to_title: '$1' left in $text\n";
    }
    if ($text =~ /[\[\]]/) {
        print "to_title: square brackets left in $text\n";
    }

    return $text;
}

sub process_text {
    my $text = $_[0];

    # fix boundary issues
    $text =~ s/<\/b$/<\/b>/;
    $text =~ s/<3/&lt;3/;
    $text =~ s/<Grin>/&lt;Grin&gt;/;
    $text =~ s/<</&lt;&lt;/;
    $text =~ s/>>/&gt;&gt;/;

    # fix image links -- don't quite know what to do with these.
    $text =~ s/<a href=&apos;(images\/[\w\-]+)\.jpg&apos; class=&apos;_blank&apos;><img class=&apos;right&apos; src=&apos;images\/[\w\-]+\.jpg&apos; alt=&apos;.*?&apos;\/><\/a>/\[IMGLINK $1\]/;
    $text =~ s/<a href=&apos;(images\/[\w\-]+)\.jpg&apos; target=&apos;_blank&apos;><img src=&apos;images\/[\w\-]+\.jpg&apos; style=&apos;.*?&apos;><\/a>/\[IMGLINK $1\]/;

    # Process links. Handle both single and double quotes.
    $text =~ s/\s*<a\s+href\s*=\s*&quot;(.*?)&quot;\s*>\s*(.*?)\s*<\/a>\s*/ \[LINK $1\]$2\[\/LINK\] /g;
    $text =~ s/\s*<a\s+href\s*=\s*&apos;(.*?)&apos;\s*>\s*(.*?)\s*<\/a>\s*/ \[LINK $1\]$2\[\/LINK\] /g;

    # Process objects. Not sure what to do with these.
    $text =~ s/\s*<object.*?value=&quot;(.*?)&quot;.*?<\/object>\s*/ \[OBJECT $1\] /;

    $text =~ s/\s*<em>\s*(.*?)\s*<\/em>\s*/ \[EM\]$1\[\/EM\] /ig;
    $text =~ s/\s*<i>\s*(.*?)\s*<\/i>\s*/ \[EM\]$1\[\/EM\] /ig;
    $text =~ s/\s*<b>\s*(.*?)\s*<\/b>\s*/ \[B\]$1\[\/B\] /ig;
    $text =~ s/\s*<strong>\s*(.*?)\s*<\/strong>\s*/ \[B\]$1\[\/B\] /ig;
    $text =~ s/\s*<u>\s*(.*?)\s*<\/u>\s*/ \[U\]$1\[\/U\] /ig;

    $text =~ s/\s*<b>\s*(.*?)\s*$/ \[B\]$1\[\/B\]/ig;
    $text =~ s/^\s*(.*?)\s*<\/b>\s*/\[B\]$1\[\/B\] /ig;
    

    $text =~ s/^\s+//;
    $text =~ s/\s\s+/ /g;
    $text =~ s/\s$//;

    # fix errors
    $text =~ s/(\[\/EM\][^<>]*)<\/em>/$1/;

    if ($text =~ /</) {
        print "Markup left in $text\n";
    }
    return $text;
}

##
# Convert to a standardized multi-line format
#
sub to_standard_format {
    my $text = $_[0];
    $text =~ s/^'//;
    $text =~ s/'$//;

    # First, recognize all the different ways in which characters can be
    # encoded in the source data
    $text =~ s/\xC3\x83\xC2\xA2\xC3\xA2\xE2\x80\x9A\xC2\xAC\xC3\xA2\xE2\x80\x9E\xC2\xA2/&rsquo;/g;
    $text =~ s/\xc3\x83\xc2\xa2\xc3\xa2\xe2\x80\x9a\xc2\xac\xc3\x85\xe2\x80\x9c/&ldquo;/g;
    $text =~ s/\xc3\x83\xc2\xa2\xc3\xa2\xe2\x80\x9a\xc2\xac\xc3\x82\xc2\x9d/&rdquo;/g;

    $text =~ s/\xc3\xa2\xe2\x82\xac\xe2\x80\x9c/&mdash;/g;
    $text =~ s/\xc3\xa2\xe2\x82\xac\xe2\x84\xa2/&rsquo;/g;

    $text =~ s/\xc3\xa2\xe2\x82\xac\xcb\x9c/&lsquo;/g;
    $text =~ s/\xC3\xA2\xE2\x82\xAC\xC5\223/&ldquo;/g;
    $text =~ s/\xC3\xA2\xE2\x82\xAC\xC2\235/&rdquo;/g;

    $text =~ s/\xc3\x83\xc2\xab/&euml;/g;

    $text =~ s/\xc3\x8a\xc2\xba/&quot;/g;
    $text =~ s/\xc3\x8b\xc2\x9d/&quot;/g;


    $text =~ s/\xe2\x80\224/&mdash;/g;
    $text =~ s/\xc3\x82\xc2\xb2/&sup2;/g;
    $text =~ s/\xc3\x83\xc2\xa9/&eacute;/g;
    $text =~ s/\xc3\x83\xc2\xa8/&egrave;/g;
    $text =~ s/\xc3\x83\xc2\xb4/&ocirc;/g;
    $text =~ s/\xe2\x80\234/&ldquo;/g;
    $text =~ s/\xe2\x80\235/&rdquo;/g;
    $text =~ s/\xc3\x83\xc2\xbc/&uuml;/g;
    $text =~ s/\xc3\x83\xc2\xad/&iacute;/g;
    $text =~ s/\xc3\x83\xc2\xa7/&ccedil;/g;
    $text =~ s/\xc3\x83\xc2\xaa/&ecirc;/g;
    $text =~ s/\xc3\x82\xc2\xb0/&deg;/g;
    $text =~ s/\xc3\x83\xc2\xa0/&agrave;/g;
    $text =~ s/\xC3\x83\xC2\xB5/&omacron;/g;
    $text =~ s/\xC3\x83\xC2\xA1/&aacute;/g;

    $text =~ s/\xc3\x82\xc2\xbd/&frac12;/g;
    $text =~ s/\xc3\x82\xc2\xba/&deg;/g;
    $text =~ s/\xc3\x82\xc2\xbc/&frac14;/g;
    $text =~ s/—/&mdash;/g;
    $text =~ s/“/&ldquo;/g;
    $text =~ s/”/&rdquo;/g;
    $text =~ s/\\"/&quot;/g;
    $text =~ s/"/&quot;/g;

    if ($text =~ /([^\n\x20-\x7f]+)/) {
        print "High-ascii character sequence '$1' in '$text'\n";
    }

    # Decode ampersand only (included double-encoded ones)
    $text =~ s/&amp;/&/g;
    $text =~ s/&amp;/&/g;

    # ------------------------------------------------------------
    # At this point, the text is all plain ascii. Now start
    # processing the content.
    # ------------------------------------------------------------

    # Split up in paragraphs
    $text =~ s/&nl;/\n/sg;
    $text =~ s/&lf;/\n/sg;
    $text =~ s/<\s*\/?\s*p\s*>/\n/sg;
    $text =~ s/<\s*\/?br\s*\/?\s*>/\n/sg;
    $text =~ s/<\/?ul>/\n/ig;
    $text =~ s/<\/?ol>/\n/ig;
    $text =~ s/<\/?li>/\n/ig;

    $text =~ s/\n\n+/\n/sg;

    my $out = "";

    my @text_list = split(/\n/, $text);
    my $i;
    for ($i = 0; defined($text_list[$i]); $i++) {
        my %img = ();
        my $img_count = 0;
        while ($text_list[$i] =~ s/\[([\d\-abcdef]+)\]/ /) {
            $img[$img_count++] = $1;
        }
        $text_list[$i] =~ s/\s\s+/ /g;
        # Figure out what to do with the paragraph
        if ($img_count == 0) {
            if ($text_list[$i] =~ /\S/) {
                $out .= process_text($text_list[$i]) . "\n";
            }
        } elsif ($img_count == 1) {
            if ($text_list[$i] =~ /\S/) {
                $out .= '[IMG ' . $img[0] . ']';
                $out .= process_text($text_list[$i]) . "\n";
            } else {
                $out .= '[IMGS][IMG ' . $img[0] . ']' . "\n";
            }
        } else {
            if ($text_list[$i] =~ /\S/) {
                $out .= process_text($text_list[$i]) . "\n";
            }
            $out .= '[IMGS]';
            my $j;
            for ($j = 0; $j < $img_count; $j++) {
                $out .= '[IMG ' . $img[$j] . ']';
            }
            $out .= "\n";
        }
    }
    
    #print $out;
#    $text =~ s/&aacute;/\x{00e1}/g;
#    $text =~ s/&agrave;/\x{00e0}/g;

#    $text =~ s/&ccedil;/\x{00e7}/g;

#    $text =~ s/&eacute;/\x{00e9}/g;
#    $text =~ s/&ecirc;/\x{00ea}/g;
#    $text =~ s/&egrave;/\x{00e8}/g;
#    $text =~ s/&euml;/\x{00eb}/g;

#    $text =~ s/&iacute;/\x{00ed}/g;

#    $text =~ s/&ntilde;/\x{00f1}/g;

#    $text =~ s/&ocirc;/\x{00f4}/g;
#    $text =~ s/&omacron;/\x{014d}/g;
#    $text =~ s/&ouml;/\x{00f6}/g;

#    $text =~ s/&uuml;/\x{00fc}/g;

#    $text =~ s/&mdash;/\x{2014}/g;
#    $text =~ s/&frac12;/\x{00bd}/g;
#    $text =~ s/&frac14;/\x{00bc}/g;
#    $text =~ s/&sup2;/\x{00b9}/g;
#    $text =~ s/&deg;/\x{00b0}/g;

#    $text =~ s/&ldquo;/\x{201c}/g;
#    $text =~ s/&rdquo;/\x{201d}/g;
#    $text =~ s/&lsquo;/\x{2018}/g;
#    $text =~ s/&rsquo;/\x{2019}/g;
#    $text =~ s/&apos;/\x{2019}/g;
#    $text =~ s/&quot;/"/g;

#    $text =~ s/&lt;/</g;
#    $text =~ s/&gt;/>/g;

#    $text =~ s/&lf;/\n/g;
#    $text =~ s/&nl;//g;
    
#    if ($text =~ /(&amp;\w+;)/) {
#        print "to_standard_format: '$1' left\n";
#    } elsif ($text =~ /(&\w+;)/) {
#        if ($1 ne '&lf;') {
#            print "to_standard_format: '$1' left\n";
#        }
#    }

    $out =~ s/^\s+//s;
    $out =~ s/\s+$//s;
    $out =~ s/\n/&lf;/sg;

    return "'$out'";
}

sub html_encode {
    my $data = $_[0];
    return uri_escape($data);
    $data =~ s/ /+/g;
    $data =~ s/\&/&amp;/g;
    return $data;
}

sub add_any {
    return if (!$gl_do_real);
    my $api = $_[0];
    my %data = %{$_[1]};
    my $ua = LWP::UserAgent->new;
    my $req = HTTP::Request->new(PUT=>"$gl_site/api/$api");

    if (defined($data{'created'}) &&
        (($data{'created'} eq "0000-00-00 00:00:00")
         || ($data{'created'} eq "'0000-00-00 00:00:00'"))) {
        $data{'created'} = $data{'updated'};
    }

    my $post_data = '';
    my $do_json = 1;
    if ($do_json) {
        $req->header('content-type' => 'application/json');
        $post_data = '{';
        foreach $key (keys %data) {
            my $value = $data{$key};
            $value =~ s/^\'(.*?)\'$/$1/;
            $value =~ s/\"/\\\"/g;
            $post_data .= '"' . $key . '": "' . $value . '", ';
        }
        $post_data =~ s/, $//;
        $post_data .= '}';
    } else {
        $req->content_type('application/x-www-form-urlencoded');
        foreach $key (keys %data) {
            $post_data .= '&' if ($post_data ne "");
            my $value = $data{$key};
            $value =~ s/^\'(.*?)\'$/$1/;
            $post_data .= html_encode($key) . '=' . html_encode($value);
        }
    }
    #print "Call to $api\n";
    $req->content($post_data);
    my $resp = $ua->request($req);
    if ($resp->is_success) {
        my $message = $resp->decoded_content;
        if (! ($message =~ /\{\"resultCode\":\"200\"/)) {
            print "Received reply: $message\n";
            print "Request was: $post_data\n";
        }
    } else {
        print "HTTP POST error code: ", $resp->code, "\n";
        print "HTTP POST error message: ", $resp->message, "\n";
    }
    # print $post_data . "\n\n";
}

sub add_trip {
    my %data = %{$_[0]};
    $data{'name'} = to_title($data{'name'});
    $data{'description'} = to_standard_format($data{'description'});
    add_any('synchTrip.php', \%data);
}

sub add_user {
    my %data = %{$_[0]};
    $data{'name'} = to_title($data{'name'});
    $data{'text'} = to_standard_format($data{'text'});
    add_any('synchUser.php', \%data);
}

sub add_trip_user {
    my %data = %{$_[0]};
    $data{'name'} = to_title($data{'name'});
    $data{'text'} = to_standard_format($data{'text'});
    $data{'message'} = to_standard_format($data{'message'});
    add_any('synchTripUser.php', \%data);
}

sub add_item {
    my %data = %{$_[0]};
    $data{'journalTitle'} = to_standard_format($data{'journalTitle'});
    $data{'journalText'} = to_standard_format($data{'journalText'});
    add_any('synchJournal.php', \%data);
}

sub add_photo {
    my %data = %{$_[0]};
    $data{'title'} = to_standard_format($data{'title'});
    $data{'caption'} = to_standard_format($data{'caption'});
    add_any('synchMedia.php', \%data);
}

sub add_comment {
    my %data = %{$_[0]};
    $data{'title'} = to_title($data{'title'});
    $data{'commentText'} = to_standard_format($data{'commentText'});
    add_any('synchComment.php', \%data);

    my $tripId = $data{'tripId'};
    my $commentId = $tripId . ':' . $data{'commentId'};
    my $referenceId = $tripId . ':' . $data{'referenceId'};

    if ($data{'deleted'} ne "'Y'") {
        $gl_ref{$commentId} = $referenceId;
    }
}

$gl_max_depth = 0;
$gl_max_depth_key = '';
$gl_max_count = 0;
$gl_max_count_key = '';

foreach $key (keys %gl_ref) {
    get_depth($key);
    add_count($key);
}

sub get_depth {
    my $key = $_[0];

    if (defined($gl_ref{$key})) {
        if (!defined($gl_depth{$key})) {
            $gl_depth{$key} = get_depth($gl_ref{$key}) + 1;
        }
        if ($gl_depth{$key} > $gl_max_depth) {
            $gl_max_depth = $gl_depth{$key};
            $gl_max_depth_key = $key;
        }
        return $gl_depth{$key};
    } else {
        return 0;
    }
}

sub add_count {
    my $key = $_[0];

    while (defined($key)) {
        if (defined($gl_count{$key})) {
            $gl_count{$key}++;
        } else {
            $gl_count{$key} = 1;
        }
        if ($gl_count{$key} > $gl_max_count) {
            $gl_max_count = $gl_count{$key};
            $gl_max_count_key = $key;
        }
        $key = $gl_ref{$key};
    }
}

print "Max depth $gl_max_depth for $gl_max_depth_key\n";
my $key1 = $gl_max_depth_key;
while (defined($gl_ref{$key1})) {
    print "   $gl_ref{$key1}\n";
    $key1 = $gl_ref{$key1};
}
print "Max count $gl_max_count for $gl_max_count_key\n";
