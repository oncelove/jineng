

const rules ={
    username:[
        { required: true, message: ' 用户名不能为空', trigger: 'blur' },
    ],
    mobile:[
        { required: true, message: ' 手机不能为空', trigger: 'blur' },
    ],
    id:[
        { required: true, message: ' id不能为空', trigger: 'blur' },
    ],
    phone:[
        { required: true, message: ' 手机不能为空', trigger: 'blur' },
    ],
    email:[
        { required: true, message: ' 邮箱不能为空', trigger: 'blur' },
    ],
    status:[
        { required: true, message: ' 状态不能为空', trigger: 'blur' },
    ],
    roleIdArray:[
        { required: true, message: ' 角色不能为空', trigger: 'blur' },
    ],
    userType:[
        { required: true, message: ' 角色属性不能为空', trigger: 'blur' },
    ],
    customerName:[
        { required: true, message: ' 客户名称不能为空', trigger: 'blur' },
    ],
    customerType:[
        { required: true, message: ' 客户类型不能为空', trigger: 'blur' },
    ],
    contacts:[
        { required: true, message: ' 联系人不能为空', trigger: 'blur' },
    ],
    assistant:[
        { required: true, message: ' 业务员不能为空', trigger: 'blur' },
    ],
    operationType:[
        { required: true, message: ' 业务类型不能为空', trigger: 'blur' },
    ],
    address:[
        { required: true, message: ' 地址不能为空', trigger: 'blur' },
    ],
    latitude:[
        { required: true, message: '纬度不能为空', trigger: 'blur' },
    ],
    longitude:[
        { required: true, message: '经度不能为空', trigger: 'blur' },
    ],
    description:[
        { required: true, message: '描述不能为空', trigger: 'blur' },
    ],
    name:[
        { required: true, message: '名称不能为空', trigger: 'blur' },
    ],
    url:[
        { required: true, message: 'url不能为空', trigger: 'blur' },
    ],
    perms:[
        { required: true, message: '权限标识不能为空', trigger: 'blur' },
    ],
    type:[
        { required: true, message: '类型不能为空', trigger: 'blur' },
    ],
    icon:[
        { required: true, message: '图标不能为空', trigger: 'blur' },
    ],
    orderNum:[
        { required: true, message: '排序不能为空', trigger: 'blur' },
    ],
    deptId:[
        { required: true, message: '部门不能为空', trigger: 'blur' },
    ],
    selectedOptions:[
        { required: true, message: '运营商不能为空', trigger: 'blur' },
    ]
}

export default rules;