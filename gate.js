/* gate.js — Joga Intelligence
   Validación de códigos de licencia por hash SHA-256 (sin códigos en claro).
   License code validation via SHA-256 hash (no plaintext codes here).
   NUNCA agregar códigos en texto plano en este archivo.
   NEVER add plaintext codes in this file.
   Uso / usage: await window.jogaGate.validate(code) -> boolean */
(function () {
  "use strict";

  // 71 hashes SHA-256 (hex, minúsculas): 1 maestro + 50 originales + 20 nuevos.
  // 71 SHA-256 hashes (hex, lowercase): 1 master + 50 original + 20 new.
  var HASHES = [
    "68d2a31f84b54d54b23e467505754f033e7ee841fa680f6bdb2c2c66ee6090f9","0e522f510d5da0b6f6a7e86cdac8762175a13443eb49498d8a16cab5cd0466c4","057da2ade04f2f7881d3c4b3e29a956a0eb60399f745f3d4f609297c10288855",
    "7d306018c72bf6472e7c5a6f572d58cfd27ac4c4836e4f2c0fe7fc1e91851f12","44d869e6acbda7dfa7edfc35546aff9c1050732217d4fad941e23d9a68d52cd5","f801377f8d4e8d229603615c26b7a83c754c271dfc22d629707f8cb73ace324e",
    "62ed1f9cfd6163de7c1677846b6483ae76e49f8c00a8c97b7c418088e13ba4c4","36166c51755a1fafd476bda4f65e12b209373310c683499194e757f8926fd854","8d0d76b3c501bd7434e81a4cc86a36e3786ef1a5ac19ea755650ae02135738d6",
    "9db6c1b71f91d50d2dbf4564a17feffb69ccc8e68834c749e33d2204e0e3ae48","0b3133637a5a2b3fece0b7f55fe19f722444194b7d89cc7689b290ce08aba7c3","5aee33446537628c78be04ca2c2a17d9f7f3d30953715b1fa8064a67bd3dba6c",
    "b0c11dc6d078e068d748f190489fe4c558cff2b80917b6e17b8bc2e11569cdfa","d41b50319302de2a840fbce6948359eb47af84bbc9da86d0c1d0c8d0c224c65b","50c123a01f833b8afe4996d57f345f1f135d34b9b4e509ade3ff22f6b0fbc83d",
    "17673924ff87c2e1771e3c600abfb83d35705557ac030e4ee22a9f095d116166","dd021d0ef2ed62f8b4a73bcab679d0c3c50016c77e8d089257c60f9c94a977f4","516d18066d3f01b0d4be8d8a10308ccb6b03e5e3a2eea6521a10ed24ce825f3c",
    "78ae394396fd2eaec63c97331b2c6884cb72ef5ef2df56a1bb07937a90648114","d23cb041709fb7c6ab641e686db0b768fd79e2ad9ffc66513390156b090fe214","00bfada3e3de967e6a24848bcdf5c4a9b3cd6f77c3ebdd32201b2a0bda3c7b2a",
    "b20b396b96a9d3f5ddd97f95aa376d05ff982511187a1750be6f8fe6f6511ea6","f8cba3a42bcf3f333245ea736188b1c7c04830ac640e3fbc127c54102eecc772","c1cddab2dc75314add8ef7c68bb859eebf1708a68e8af45fd11df3f4aaea47c4",
    "4e149590e9267081eda586eba0eef79dd2b5456adf42f946f1f67b14c851521c","15013dec46576189ae24eb91fd838cb6c5d1cd13c49ce9381e144b25023cf1f6","034dc5d0e0a78b9dd51447cd55b1feb501b2f066d6df1afc0cb0319cd83e6153",
    "cc8a32595a52dfbb3786fb32e5373c0b1658817a9585783d464fd36e9e71996c","b7e465e2cfa931fbfdf4578260ad11d78fc41e1f1e71e930c1910ef388f4e834","86df6acc51e94cf91cffbb7d48aa2592d4a1f1c8afebbdc7071f89fe2f29e2c9",
    "6361ff1e3f73e319eb3c19b92ec60b2cff938aeb0cc680f2f35a711ba94757dd","94e6e62df2a602ccb99653d589677d7a5842ec7cec8af0df031d91c4df236412","c5bc856a9003f4090b0640daf6b65b41fb10fdc950f0ce813356cdd8c2695e9e",
    "25116d0668a26f592820d9e6e3d04fe4d0d04ceaa5a3916c50bbe33b45ab3bd0","bb79b49303809b0a4921388e2147710172cee652550098bd6ee60c06af8763a2","b6c87efcfe60a05d9096534ffd58110fbb04b54f91b682145e74cc6be7c75af5",
    "bdec3b83e9d0eef826690fa317a245560c4113b89eac41efdba836092114da93","ea5dd96172c07f611d3084cb23a0a6782b8f36cdc1e126a17503380ddf3faf2f","878d6541626956373d1ed9d429536aa2daab4cb4de5f8a54c963f9a602659ad4",
    "ffe5a7bbe02a72aab4c4d37237cbf04020fa44eb8e8ff1ed0895037a60b094e9","a9a1c8286925e195df844ec8f413bd6a841e3bb1e6c1fbab114c9f58ccc3c8fb","de11c44cf20d7035fd754230e4822fe424850bf1378fea88129dabf5defe20b8",
    "86dc7abb63ef50cb16e81879a2885ca5a66d3304fc26531474c59b50f25daa72","8655d66ce376d1cdae8ebb5fd7ce22527fe3952df18ae003c9b1deb6dc5424e7","f9a700f1a6a5eb0318e628831ddd799bb73e8750ee9322fc92fe971a48da409a",
    "57e8f955671ac789984b08d6878196e9a1fca78cce37d9a70114e91a665e09c5","1ec84b775b034e5addd8c8f76656442071994221e9aa398e5256a38bcd8e9205","b51ff027f0ce954db977ea544a3957c18735fccb5e7340325ea73766ac22b4e9",
    "facae6b6321a5dfc21823c6e0ac2311ece7449f29bd062e701be667fa628d9ca","8c640edc78f2b795ef890f57ba9dc732a5279aeb4e2cdb34be79a00703d859c4","d529c9b9eb7bb7e666390fe301e77af0b14cf3be6b980b97e3253fc25f4b46b8",
    "1569b405a3d87c672b34ffe27e9c520a287122da200ab0e65b1d8d93f7174ba1","de87bed5b570c8a433e1bf89538a78fa8d94a1280e8b50669521ae7301117da0","4b8a342bad89f9382353822348258d9d2329072da22d50df28de02feec59ac9c",
    "f3519c3a71b2927e1dbd8a442abdf4fa7d1fbb24e576ef3293fd35acdbe9052b","a301d5a14711d803e5c2b410f0b8b20e4fe165762224c3649b227f9f19ae2535","f490058d6158d26b470143ff94665f5b02fb0302958d30f235589e3f25a7f606",
    "2d296d1ccf1d3c781a6966534a4bd44b0cc2bd49a382c7f1a9c0befff6a9902b","a0169a289e300ef2156efe0207aa7d1ee1d7481ded24f1cb94ac2c036c16279a","64188f643d167539c80a3f84d5d7452cca2221714c39dd8c6360dc85e11c41ad",
    "495edfb61edfb690663128586898a08e0d26b0b5673b0f7f5bdeb94b471c1071","035c604d12c4d26f7d2c082be7dc7fc6c0fedcac7119deff911845c7e15cd2f9","8447416801dbcafd268725415effa9699b756ecb5f62f207fb1a71079b494564",
    "881d2164cf234e1997c97d26f55470f621c899218739cfb2f864b662da5a7089","6d59a174fcf21613eaf258eb18d932bf706ed656876310f8823427cc7f3ca87b","43e9183e867026fbce2d336882c8fd3f368e82bf75400ccfb52d1cda21a60fdb",
    "ff136d90b42e742b7ee7322a1dd58b8db1217e2374b2d25340ac60607db5a8f8","fdbeff09f1021bd94c9ea2087a6317b9311d447db5c0d79b8e7150651ecfd580","8cae7f1a2e2b57694d050f21f56ef4e1bf5562ef258d87d64e4858b6b33d0784",
    "dbdf4a482f2bb5090434899f3303bc38b05cd64877763d3bc3eaa11b66b70bb0","e6cc3ce8d1d5da41e0e2f6b431a2db026d88cf1cfdf63b7939594239a592cd79"
  ];

  // bytes -> hex (minúsculas) / bytes -> hex (lowercase)
  function bufToHex(buf) {
    var bytes = new Uint8Array(buf), hex = "";
    for (var i = 0; i < bytes.length; i++) {
      var h = bytes[i].toString(16);
      hex += h.length === 1 ? "0" + h : h;
    }
    return hex;
  }

  async function sha256Hex(str) {
    var data = new TextEncoder().encode(str);
    var digest = await crypto.subtle.digest("SHA-256", data);
    return bufToHex(digest);
  }

  // Valida un código contra los hashes. Nunca lanza error.
  // Validates a code against the hashes. Never throws.
  async function validate(code) {
    try {
      if (!(window.crypto && window.crypto.subtle && window.crypto.subtle.digest)) {
        return false; // fallback sin crypto.subtle / no-crypto fallback
      }
      var v = (code == null ? "" : String(code)).trim().toUpperCase();
      if (!v) return false;
      var hash = await sha256Hex(v);
      for (var i = 0; i < HASHES.length; i++) {
        if (HASHES[i] === hash) return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  window.jogaGate = { validate: validate };
})();
