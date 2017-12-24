window.pinkCalf = {
    RandomBoth: function (Min, Max) {
        let Range = Max - Min;
        let Rand = Math.random();
        return Min + Math.round(Rand * Range); //四舍五入
    },
    generateCube: function (width, height, depth, color) {
        let geometry = new THREE.BoxGeometry(width, height, depth);
        let material = new THREE.MeshPhongMaterial({color: color});
        return new THREE.Mesh(geometry, material);
    }
};