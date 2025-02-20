/**
 * @name DiscordBypass
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.1.4
 * @invite SgKSKyh9gY
 * @description A Collection of patches into one, Check plugin settings for features.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/DiscordBypass.plugin.js
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
module.exports = (() => {
  const config = {
    info: {
      name: "DiscordBypass",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.1.4",
      description:
        "A Collection of patches into one, Check plugin settings for features.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/DiscordBypass.plugin.js",
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
          "I :3 wannya *looks at you* cuddwe w-w-with my fiancee :3 (p≧w≦q)",
        ],
      },
      {
        title: "v1.0.1",
        items: ["Infinity account in account switcher"],
      },
      {
        title: "v1.0.7",
        items: ["Added option to stop your stream preview from posting"],
      },
      {
        title: "v1.0.8",
        items: ["Added Discord Experiments"],
      },
      {
        title: "v1.1.1",
        items: [
          "Added Spotify Listen Along without premium.",
          "Fixed Setting items not updating on click.",
        ],
      },
    ],
    main: "DiscordBypass.plugin.js",
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
          Utilities,
          Logger,
          PluginUpdater,
          Settings: { SettingPanel, Switch, Textbox },
          DiscordModules: {
            CurrentUserIdle,
            UserStore,           
            ExperimentsManager,           
            ElectronModule,
          },
        } = Library;
        const Dispatcher = WebpackModules.getByProps(
          "dispatch",
          "_actionHandlers"
        );
        const { V7: Timeout } = WebpackModules.getModule(
          (m) =>
            m?.V7?.prototype?.start &&
            m?.V7?.toString?.() == "function e(){r(this,e)}"
        );
        const DiscordConstants = WebpackModules.getModule( 
          (m) => m?.Plq?.ADMINISTRATOR == 8n
        );
        const ChannelPermissionStore = WebpackModules.getByProps(
          "getChannelPermissions"
        );
        const getBase64FromUrl = async (url) => {
          const data = await fetch(url);
          const blob = await data.blob();
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              const base64data = reader.result;
              resolve(base64data);
            };
          });
        };
        const isImage = (url) => {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
        };
        const DeviceStore = WebpackModules.getModule(
          (m) =>
            m?.Ai?.toString?.()?.includes("SPOTIFY_PROFILE_UPDATE")
        );
        const isSpotifyPremium = WebpackModules.getModule(
          (m) =>
            m?.yp?.toString?.()?.includes("spotify account is not premium") 
        );
        const defaultSettings = {
          NSFW: !UserStore.getCurrentUser().nsfwAllowed,
          bandwidth: true,
          PTT: true,
          streamPreview: true,
          fakePreview: "",
          noAFK: true,
          experiments: true,
          spotify: true,
          verification: true,
        };
        return class DiscordBypass extends Plugin {
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
          async onStart() {
            this.checkForUpdates();
            this.initialize();
          }
          initialize() {
            if (this.settings["NSFW"]) this.bypassNSFW();
            if (this.settings["bandwidth"]) this.patchTimeouts();
            if (this.settings["PTT"]) this.patchPTT();
            if (this.settings["streamPreview"]) this.patchStreamPreview();
            if (this.settings["noAFK"]) this.noIdle();
            if (this.settings["spotify"]) this.patchSpotify();
            if (this.settings["experiments"]) this.enableExperiment();
            if (this.settings["verification"]) this.patchGuildVerificationStore(true);
          }
          bypassNSFW() {
            BdApi.Patcher.after(config.info.name, UserStore, "getCurrentUser", (_, args, res) => {
              if (!res?.nsfwAllowed && res?.nsfwAllowed !== undefined) {
                res.nsfwAllowed = true;
              }
            });
          }
          patchTimeouts() {
            BdApi.Patcher.after(config.info.name, Timeout.prototype, "start", (timeout, [_, args]) => {
              if (args?.toString().includes("BOT_CALL_IDLE_DISCONNECT")) {
                timeout.stop();
              }
            });
          }
          patchPTT() {
            BdApi.Patcher.after(config.info.name, ChannelPermissionStore, "can", (_, args, res) => {
              if (args[0] == DiscordConstants.Plq.USE_VAD) return true;
            });
          }
          async patchStreamPreview() {
            const replacePreviewWith = isImage(this.settings["fakePreview"])
              ? await getBase64FromUrl(this.settings["fakePreview"])
              : null;
            if (!replacePreviewWith)
              Logger.warn(
                "No Image link provided so not gonna show anything as stream preview."
              );
            BdApi.Patcher.instead(config.info.name, 
              ElectronModule,
              "makeChunkedRequest",
              (_, args, res) => {
                if (!args[0].includes("preview") && args[2].method !== "POST")
                  return res();
                if (!replacePreviewWith) return;
                res(args[0], { thumbnail: replacePreviewWith }, args[2]);
              }
            );
          }
          noIdle() {
            BdApi.Patcher.instead(config.info.name, CurrentUserIdle, "getIdleSince", () => null);
            BdApi.Patcher.instead(config.info.name, CurrentUserIdle, "isIdle", () => false);
            BdApi.Patcher.instead(config.info.name, CurrentUserIdle, "isAFK", () => false);
          }
          enableExperiment() {
            const nodes = Object.values(
              ExperimentsManager._dispatcher._actionHandlers._dependencyGraph
                .nodes
            );
            try {
              nodes
                .find((x) => x.name == "ExperimentStore")
                .actionHandler["OVERLAY_INITIALIZE"]({
                  user: { flags: 1 },
                  type: "CONNECTION_OPEN",
                });
            } catch (err) {}
            const oldGetUser = UserStore.getCurrentUser;
            UserStore.getCurrentUser = () => ({
              hasFlag: () => true,
            });
            nodes
              .find((x) => x.name == "DeveloperExperimentStore")
              .actionHandler["OVERLAY_INITIALIZE"]();
            UserStore.getCurrentUser = oldGetUser;
          }
          patchSpotify() {
            BdApi.Patcher.instead(config.info.name, DeviceStore, "Ai", (_, [id]) => {
              Dispatcher.dispatch({
                type: "SPOTIFY_PROFILE_UPDATE",
                accountId: id,
                isPremium: true,
              });
            });
            BdApi.Patcher.instead(config.info.name, isSpotifyPremium, "Wo", () => true);

          }
          patchGuildVerificationStore(toggle){
            Object.defineProperty(DiscordConstants, "fDV", {
              value: toggle ? {ACCOUNT_AGE: 0, MEMBER_AGE: 0} : {ACCOUNT_AGE: 5, MEMBER_AGE: 10},
              configurable: true,
              enumerable: true,
              writable: true
          });
          }
          onStop() {
            BdApi.Patcher.unpatchAll(config.info.name);
            this.patchGuildVerificationStore(false);
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new Switch(
                "NSFW Bypass",
                "Bypass NSFW Age restriction",
                this.settings["NSFW"],
                (e) => {
                  this.settings["NSFW"] = e;
                },
                {
                  disabled: UserStore.getCurrentUser().nsfwAllowed,
                }
              ),
              new Switch(
                "Call Timeout",
                "Let you stay alone in call for more than 5 mins.",
                this.settings["bandwidth"],
                (e) => {
                  this.settings["bandwidth"] = e;
                }
              ),
              new Switch(
                "No Push to talk",
                "Let you use voice Activity in push to talk only channels.",
                this.settings["PTT"],
                (e) => {
                  this.settings["PTT"] = e;
                }
              ),
              new Switch(
                "Custom Stream Preview",
                "Stop stream preview to be rendered for others if no image link provided else the image is rendered as stream preview.",
                this.settings["preview"],
                (e) => {
                  this.settings["preview"] = e;
                }
              ),
              new Textbox(
                "Image Link",
                "Link of image for custom stream preview (Must be Under 200kb, By Default it shows nothing).",
                this.settings["fakePreview"],
                (e) => {
                  this.settings["fakePreview"] = e;
                }
              ),
              new Switch(
                "No AFK",
                "Stops Discord from setting your presense to idle and Probably no afk in vc too.",
                this.settings["noAFK"],
                (e) => {
                  this.settings["noAFK"] = e;
                }
              ),
              new Switch(
                "Discord Experiments",
                "Enable discord experiments tab and shit.",
                this.settings["experiments"],
                (e) => {
                  this.settings["experiments"] = e;
                }
              ),
              new Switch(
                "Spotify Listen Along",
                "Enables Spotify Listen Along feature on Discord without Premium.",
                this.settings["spotify"],
                (e) => {
                  this.settings["spotify"] = e;
                }
              ),
              new Switch(
                "Guild Verification",
                "Remove 10 mins wait before joining VCs in newly joined guilds.",
                this.settings["verification"],
                (e) => {
                  this.settings["verification"] = e;
                }
              )
            );
          }
          saveSettings() {
            Utilities.saveData(config.info.name, "settings", this.settings);
            this.stop();
            this.initialize();
          }
        };
        return plugin(Plugin, Library);
      })(window.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
