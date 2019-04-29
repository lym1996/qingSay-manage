export function sortKey(array){
    return array.sort(function(a,b){
        var x = a.total;
        var y = b.total;
        return ((x>y)?-1:(x<y)?1:0)
    })
}