/**
 * @name Token
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.1.1
 * @invite SgKSKyh9gY
 * @description Get a option to copy your token by right clicking on home button.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/Token.plugin.js
 */
/*@cc_on
@if (@_jscript)
var shell = WScript.CreateObject("WScript.Shell");
var fs = new ActiveXObject("Scripting.FileSystemObject");
var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
var pathSelf = WScript.ScriptFullName;
shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
} else if (!fs.FolderExists(pathPlugins)) {
shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
} else if (shell.Popup("Should I move myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
fs.MoveFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)));
shell.Exec("explorer " + pathPlugins);
shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
}
WScript.Quit();
@else@*/
module.exports = ((_) => {
  const config = {
    info: {
      name: "Token",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.1.1",
      description:
        "Get a option to copy your token by right clicking on home button.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/Token.plugin.js",
    },
    changelog: [
      {
        title: "v0.0.1",
        items: ["Idea in mind"],
      },
      {
        title: "v0.0.5",
        items: ["Base Model"],
      },
      {
        title: "Initial Release v1.0.0",
        items: [
          "This is the initial release of the plugin :)",
          "Get 2FA bitch (/≧▽≦)/",
        ],
      },
    ],
    main: "Token.plugin.js",
  };
  return !window.hasOwnProperty("ZeresPluginLibrary")
    ? class {
        load() {
          BdApi.showConfirmationModal(
            "ZLib Missing",
            `The library plugin (ZeresPluginLibrary) needed for ${config.info.name} is missing. Please click Download Now to install it.`,
            {
              confirmText: "Download Now",
              cancelText: "Cancel",
              onConfirm: () => this.downloadZLib(),
            }
          );
        }
        async downloadZLib() {
          const fs = require("fs");
          const path = require("path");
          const ZLib = await fetch(
            "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js"
          );
          if (!ZLib.ok) return this.errorDownloadZLib();
          const ZLibContent = await ZLib.text();
          try {
            await fs.writeFile(
              path.join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"),
              ZLibContent,
              (err) => {
                if (err) return this.errorDownloadZLib();
              }
            );
          } catch (err) {
            return this.errorDownloadZLib();
          }
        }
        errorDownloadZLib() {
          const { shell } = require("electron");
          BdApi.showConfirmationModal(
            "Error Downloading",
            [
              `ZeresPluginLibrary download failed. Manually install plugin library from the link below.`,
            ],
            {
              confirmText: "Download",
              cancelText: "Cancel",
              onConfirm: () => {
                shell.openExternal(
                  "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js"
                );
              },
            }
          );
        }
        start() {}
        stop() {}
      }
    : (([Plugin, Library]) => {
        const {
          WebpackModules,
          Patcher,
          ContextMenu,
          Utilities,
          PluginUpdater,
          ReactTools,
          Logger,
          Toasts,
          Settings: { SettingPanel, Switch },
          DiscordModules: { React },
        } = Library;
        const { clipboard } = require("electron");
        const TokenStore = WebpackModules.getByProps("getToken");
        const TokenIcon = (width, height) =>
          React.createElement(
            "svg",
            {
              viewBox: "0 0 24 24",
              width,
              height,
            },
            React.createElement("path", {
              style: {
                fill: "currentColor",
              },
              d: "M6.25 4.5C7.2165 4.5 8 5.2835 8 6.25V8H6.25C5.2835 8 4.5 7.2165 4.5 6.25C4.5 5.2835 5.2835 4.5 6.25 4.5ZM9.5 8V6.25C9.5 4.45507 8.04493 3 6.25 3C4.45507 3 3 4.45507 3 6.25C3 8.04493 4.45507 9.5 6.25 9.5H8V14.5H6.25C4.45507 14.5 3 15.9551 3 17.75C3 19.5449 4.45507 21 6.25 21C8.04493 21 9.5 19.5449 9.5 17.75V16H14.5V17.75C14.5 19.5449 15.9551 21 17.75 21C19.5449 21 21 19.5449 21 17.75C21 15.9551 19.5449 14.5 17.75 14.5H16V9.5H17.75C19.5449 9.5 21 8.04493 21 6.25C21 4.45507 19.5449 3 17.75 3C15.9551 3 14.5 4.45507 14.5 6.25V8H9.5ZM9.5 9.5H14.5V14.5H9.5V9.5ZM16 8V6.25C16 5.2835 16.7835 4.5 17.75 4.5C18.7165 4.5 19.5 5.2835 19.5 6.25C19.5 7.2165 18.7165 8 17.75 8H16ZM16 16H17.75C18.7165 16 19.5 16.7835 19.5 17.75C19.5 18.7165 18.7165 19.5 17.75 19.5C16.7835 19.5 16 18.7165 16 17.75V16ZM8 16V17.75C8 18.7165 7.2165 19.5 6.25 19.5C5.2835 19.5 4.5 18.7165 4.5 17.75C4.5 16.7835 5.2835 16 6.25 16H8Z",
            })
          );
        const defaultSettings = {
          showToast: true,
        };
        const HomeButton = WebpackModules.getByProps("HomeButton");
        const NavBar = WebpackModules.getByProps("guilds", "base");
        const ContextMenuAPI = (window.HomeButtonContextMenu ||= (() => {
          const items = new Map();
          function insert(id, item) {
            items.set(id, item);
            forceUpdate();
          }
          function remove(id) {
            items.delete(id);
            forceUpdate();
          }
          function forceUpdate() {
            const toForceUpdate = ReactTools.getOwnerInstance(
              document.querySelector(`.${NavBar.guilds}`)
            );
            const original = toForceUpdate.render;
            toForceUpdate.render = function forceRerender() {
              original.call(this);
              toForceUpdate.render = original;
              return null;
            };
            toForceUpdate.forceUpdate(() =>
              toForceUpdate.forceUpdate(() => {})
            );
          }
          Patcher.after(HomeButton, "HomeButton", (_, args, res) => {
            const HomeButtonContextMenu = Array.from(items.values()).sort(
              (a, b) => a.label.localeCompare(b.label)
            );
            const PatchedHomeButton = ({ originalType, ...props }) => {
              const returnValue = Reflect.apply(originalType, this, [props]);
              try {
                returnValue.props.onContextMenu = (event) => {
                  ContextMenu.openContextMenu(
                    event,
                    ContextMenu.buildMenu(HomeButtonContextMenu)
                  );
                };
              } catch (err) {
                Logger.err("Error in DefaultHomeButton patch:", err);
              }
              return returnValue;
            };
            const originalType = res.type;
            res.type = PatchedHomeButton;
            Object.assign(res?.props, {
              originalType,
            });
          });
          return {
            items,
            remove,
            insert,
            forceUpdate,
          };
        })());
        return class Token extends Plugin {
          constructor() {
            super();
            this.settings = Utilities.loadData(
              config.info.name,
              "settings",
              defaultSettings
            );
          }
          checkForUpdates() {
            try {
              PluginUpdater.checkForUpdate(
                config.info.name,
                config.info.version,
                config.info.github_raw
              );
            } catch (err) {
              Logger.err("Plugin Updater could not be reached.", err);
            }
          }
          start() {
            this.checkForUpdates();
            this.addMenu();
          }
          addMenu() {
            ContextMenuAPI.insert("copyToken", this.makeMenu());
          }
          makeMenu() {
            return {
              label: "Copy Token",
              id: "copy-token",
              icon: () => TokenIcon("20", "20"),
              action: async () => {
                try {
                  let token = await TokenStore.getToken();
                  if (!token) {
                    Logger.err(`Whoops! I couldn't find your token.`);
                    if (this.settings["showToast"])
                      Toasts.show(`Whoops! I couldn't find your token.`, {
                        icon: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/ic_fluent_error_circle_24_regular.png",
                        timeout: 5000,
                        type: "error",
                      });
                    return;
                  }
                  clipboard.writeText(token);
                  if (this.settings["showToast"])
                    Toasts.show(`Token Copied to Clipboard.`, {
                      icon: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/ic_fluent_send_copy_24_regular.png",
                      timeout: 5000,
                      type: "success",
                    });
                } catch (err) {
                  Logger.err(err);
                  if (this.settings["showToast"])
                    Toasts.show(` Error: ${err}.`, {
                      icon: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/ic_fluent_error_circle_24_regular.png",
                      timeout: 5000,
                      type: "error",
                    });
                }
              },
            };
          }
          onStop() {
            ContextMenuAPI.remove("copyToken");
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new Switch(
                "Popup/Toast",
                "Confirmation/Error message when copying token",
                this.settings["showToast"],
                (e) => {
                  this.settings["showToast"] = e;
                }
              )
            );
          }
          saveSettings() {
            Utilities.saveData(config.info.name, "settings", this.settings);
          }
        };
        return plugin(Plugin, Library);
      })(window.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
