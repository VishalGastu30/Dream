#!/bin/bash
git ls-files --others --exclude-standard | while read -r file; do
    git add "$file"
    
    # Determine type
    if [[ "$file" == docs/* ]] || [[ "$file" == *.md ]]; then
        type="docs"
    elif [[ "$file" == .github/* ]]; then
        type="ci"
    elif [[ "$file" == scripts/* ]] || [[ "$file" == .agents/* ]] || [[ "$file" == *package.json ]] || [[ "$file" == *tsconfig* ]] || [[ "$file" == .* ]]; then
        type="chore"
    else
        type="feat"
    fi
    
    git commit -m "$type: scaffold $file" -m "Initial scaffold in Phase 0."
done
