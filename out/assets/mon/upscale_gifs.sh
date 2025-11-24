#!/bin/bash

# Set the desired height for upscaling
DESIRED_HEIGHT=140

# Input and output directories
INPUT_DIR="ano"
OUTPUT_DIR="an"

# Create the output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Check if the input directory exists
if [ ! -d "$INPUT_DIR" ]; then
    echo "Error: Input directory '$INPUT_DIR' does not exist."
    exit 1
fi

# Loop through all GIF files in the input directory
for gif in "$INPUT_DIR"/*.gif; do
    # Check if there are any GIF files in the directory
    if [ ! -e "$gif" ]; then
        echo "No GIF files found in '$INPUT_DIR'."
        exit 0
    fi

    # Get the base name of the file (without extension)
    BASENAME=$(basename "$gif" .gif)

    echo "Processing $gif..."

    # Step 1: Decompose the GIF into individual frames
    magick "$gif" -coalesce "${BASENAME}_frame_%04d.png"

    # Step 2: Resize each frame
    for frame in ${BASENAME}_frame_*.png; do
        magick "$frame" -resize x$DESIRED_HEIGHT -filter Lanczos -define filter:blur=0.75 -unsharp 0x0.75+1.0+0.05 "$frame"
    done

    # Step 3: Reassemble the GIF
    magick -delay 10 -loop 0 ${BASENAME}_frame_*.png "$OUTPUT_DIR/${BASENAME}.gif"

    # Step 4: Cleanup intermediate frames
    rm ${BASENAME}_frame_*.png

    echo "$gif has been upscaled and saved to $OUTPUT_DIR/${BASENAME}.gif"
done

echo "All GIFs processed! Upscaled files are in the '$OUTPUT_DIR' folder."