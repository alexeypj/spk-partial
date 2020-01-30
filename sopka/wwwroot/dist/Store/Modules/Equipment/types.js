export function volumeDict(dictinaries) {
    return dictinaries.map(x => ({ Key: x.Key, Value: `${x.Value} ${x.Data}Gb` }));
}
export function networkAdaptersDict(dictinaries) {
    return dictinaries.map(x => ({ Key: x.Key, Value: `${x.Value} ${x.Data} Mbps` }));
}
//# sourceMappingURL=types.js.map