
 function power (vm, infoList, addBtn, deleteBtn, updateBtn) {
    console.log(vm.$store.state.permissions);

    let permissions = vm.$store.state.permissions;

    let permissionsBox = {};

    if (permissions) {
        if (!permissions.includes(infoList)) {
            // console.log(permissions.includes(infoList))
            vm.$router.push('/')
        }

        if (permissions.includes(addBtn)) {
            permissionsBox.addBtn = true;
        }

        if (permissions.includes(deleteBtn)) {
            permissionsBox.deleteBtn = true;
        }

        if (permissions.includes(updateBtn)) {
            permissionsBox.updateBtn = true;
        }
    }

    return permissionsBox;
}

export {power}