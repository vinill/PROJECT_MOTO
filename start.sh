#!/usr/bin/env bash
#First, update your package index.
sudo apt-get update
#Download the latest Elasticsearch version, which is 2.3.1 at the time of writing.
wget https://download.elastic.co/elasticsearch/release/org/elasticsearch/distribution/deb/elasticsearch/2.3.1/elasticsearch-2.3.1.deb
#Then install it in the usual Ubuntu way with dpkg.
sudo dpkg -i elasticsearch-2.3.1.deb
