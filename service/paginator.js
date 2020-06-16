
exports.getArray = (count, limit, prefix ,activePage = 1) => { // 101, 20
    const pages=Math.ceil(count/limit);
    const a=[];
    for(let i=1;i<=pages;i++){
        a.push({
            'text': i,
            'link': prefix + 'page=' + i,
            'active': activePage === i
        });        
    }
    return a;
}


