const { Menu, shell, app } = require("electron");

module.exports = appWin => {
  // Menu template
  let template = [
    {
      label: "Item",
      submenu: [
        {
          label: "Add New",
          accelerator: "CmdOrCtrl+O",
          click: () => {
            appWin.send("menu-show-modal");
          },
        },
        {
          label: "Read Item",
          accelerator: "CmdOrCtrl+Enter",
          click: () => {
            appWin.send("menu-open-item");
          },
        },
        {
          label: "Delete Item",
          accelerator: "CmdOrCtrl+Backspace",
          click: () => {
            appWin.send("menu-delete-item");
          },
        },
      ],
    },
    {
      role: "editMenu",
    },
    {
      role: "windowMenu",
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn more",
          click: () => {
            shell.openExternal(
              "https://github.com/stackacademytv/master-electron"
            );
          },
        },
      ],
    },
  ];

  if (process.platform === "darwin") template.unshift({ role: "appMenu" });

  // Build menu
  let menu = Menu.buildFromTemplate(template);

  // Set as main app menu
  Menu.setApplicationMenu(menu);
};
