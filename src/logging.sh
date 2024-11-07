#!/bin/sh

dataset_dir="../dataset"
date=$(date +"%Y-%m-%dT%H:%M:%S%z")
algorithm="fib"
execution="node"

echo $process

if  [ ! -d $dataset_dir ]; then
    mkdir $dataset_dir
fi

while [$process = ""] ; do
    process=$(pidof node)
done

process=$(pidof node)
psrecord $process --log "$dataset_dir/$date-$algorithm-$execution.txt" --interval 1
