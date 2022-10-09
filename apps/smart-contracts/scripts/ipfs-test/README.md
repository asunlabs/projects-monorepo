# How to update immutable IPFS metadata

1. Create a IPFS key

```sh
ipfs key gen test
```

2. Back up the key for production.

```sh
ipfs key export -o /path/to/save/test.key test
```

3. Add metadata.

```json:firstJake.json
{
    "name": "first jake"
}
```

```sh
# get CID: e.g) xx123
ipfs add firstJake.json
```

4. Publish IPNS with the paired key.

```sh
# ipns published to : /ipns/aa00
ipfs name publish -k test xx123
```

5. Update the metadata and add the data.

```json:newJake.json
{
    "name": "new jake"
}
```

```sh
# get CID: yy123
ipfs add newJake.json
```

6. Update IPNS object.

```sh
# published to : /ipns/aa00
ipfs name publish -k test yy123
```

7. Check the updated metadata

```sh
# output: newJake.json
ipfs get /ipns/aa00
```

## Reference

- [IPFS: How to add a file to an existing folder?](https://stackoverflow.com/questions/39803954/ipfs-how-to-add-a-file-to-an-existing-folder)
