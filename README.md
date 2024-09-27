# Tone Theme for JSON Resume

A self-contained theme for [JSON Resume](http://jsonresume.org/). 
Designed to work offline and hosted on github pages.

## Usage

```sh
# Install resume-cli via npm, yarn, pnpm, or whatever package manager you want
npm install --global resume-cli

# Install @jsonresume/jsonresume-theme-class in the directory resume.json is in
npm install @jsonresume/jsonresume-theme-class

# Export as an HTML page, ready to be served by any web server
resume export --theme @jsonresume/jsonresume-theme-class index.html

# Export a PDF document, it's recommended to use your name as the file name
resume export --theme @jsonresume/jsonresume-theme-class your-name.pdf
```

### Notes

* It's recommended to declare the `meta.language` property in your JSON Resume for accessibility. This is the [BCP47 tag](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/lang#language_tag_syntax) for the language your your résumé is written in. For example, `en` for English.

## Features

### JSON Resume 1.0.0

This supports the JSON Resume 1.0.0 spec, and is backward compatible with earlier versions.

### Application Tracking System (ATS) Friendly

Many companies and recruiters use [ATS](https://en.wikipedia.org/wiki/Applicant_tracking_system) systems that [parse CV's](https://en.wikipedia.org/wiki/R%C3%A9sum%C3%A9_parsing) and extract the information into a standard format. Part of maintaining this theme includes reviewing this and adhering to standard practices when building the résumé.

### Markdown

You can use inline Markdown on properties to make text bold, italic, or link them to external pages. This namely applies to the `summary` and `highlights` properties in the JSON Resume schema.

### Open Graph Protocol

Populates the `head` of the HTML document with [Open Graph](https://ogp.me/) tags. This allows social media platforms and instant messengers to create embeds when your résumé is shared.

### Dark Mode

Includes a dark mode, and uses the [`prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) CSS property to provide a positive user-experience.

### Optimized

This theme makes no external connections, doesn't embed scripts, and is lightweight by design. Both HTML and PDF exports will be minimal.

## Preview

<div style="display: flex; justify-content: space-between;">
    <img 
      src="./assets/preview-dark.png" 
      alt="Preview of Dark Tone theme for JSON Resume in dark mode." 
      style="width: 48%; border-radius: 10px">
    <img 
      src="./assets/preview-light.png" 
      alt="Preview of Light Tone theme for JSON Resume." 
      style="width: 48%; border-radius: 10px">
</div>
