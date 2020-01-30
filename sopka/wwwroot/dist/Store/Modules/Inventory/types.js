export function hasChanges(source, target) {
    return source.Id !== target.Id ||
        source.ContactMail !== target.ContactMail ||
        source.ContactPerson !== target.ContactPerson ||
        source.ContactPhone !== target.ContactPhone ||
        source.ContactPosition !== target.ContactPosition ||
        source.IdBranch !== target.IdBranch ||
        source.IdType !== target.IdType ||
        source.Latitude !== target.Latitude ||
        source.Longitude !== target.Longitude ||
        source.ObjectAddress !== target.ObjectAddress ||
        source.ObjectName !== target.ObjectName;
}
//# sourceMappingURL=types.js.map