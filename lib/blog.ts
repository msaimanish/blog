import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
const dir=path.join(process.cwd(),'content/blog');
export type Post={slug:string;title:string;date:string;summary:string;tags:string[];draft:boolean;content:string;readingTime:number};
export function getPosts():Post[]{if(!fs.existsSync(dir))return [];return fs.readdirSync(dir).filter(f=>f.endsWith('.mdx')).map(file=>{const raw=fs.readFileSync(path.join(dir,file),'utf8');const {data,content}=matter(raw);const words=content.trim().split(/\s+/).filter(Boolean).length;return {slug:file.replace(/\.mdx$/,''),title:String(data.title||file),date:String(data.date||''),summary:String(data.summary||''),tags:Array.isArray(data.tags)?data.tags.map(String):[],draft:Boolean(data.draft),content,readingTime:Math.max(1,Math.ceil(words/220))};}).filter(p=>!p.draft).sort((a,b)=>b.date.localeCompare(a.date));}
export function getPost(slug:string){return getPosts().find(p=>p.slug===slug);}
