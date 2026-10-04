using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace Mananti
{
    static class Program
    {
        [DllImport("shell32.dll")]
        static extern void SHChangeNotify(int wEventId, uint uFlags, IntPtr dwItem1, IntPtr dwItem2);

        [STAThread]
        static void Main(string[] args)
        {
            string url = "https://mananti-demo.vercel.app/";
            string desktopDir = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
            string startMenuDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Programs), "MANANTI");
            string appDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "MANANTI");

            try
            {
                if (!Directory.Exists(appDir))
                {
                    Directory.CreateDirectory(appDir);
                }

                // Copy current exe to AppData if not already running from there
                string currentExe = Process.GetCurrentProcess().MainModule.FileName;
                string installedExe = Path.Combine(appDir, "MANANTI.exe");
                if (!string.Equals(currentExe, installedExe, StringComparison.OrdinalIgnoreCase))
                {
                    File.Copy(currentExe, installedExe, true);
                    CreateShortcut(Path.Combine(desktopDir, "MANANTI - Psychiatry Care.lnk"), installedExe, "MANANTI Psychiatry Care Software");
                    
                    if (!Directory.Exists(startMenuDir))
                    {
                        Directory.CreateDirectory(startMenuDir);
                    }
                    CreateShortcut(Path.Combine(startMenuDir, "MANANTI.lnk"), installedExe, "MANANTI Psychiatry Care Software");
                }
            }
            catch { }

            // Launch Standalone Browser Window
            string edge = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Microsoft\Edge\Application\msedge.exe");
            if (!File.Exists(edge))
                edge = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Microsoft\Edge\Application\msedge.exe");

            string chrome = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Google\Chrome\Application\chrome.exe");
            if (!File.Exists(chrome))
                chrome = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Google\Chrome\Application\chrome.exe");

            ProcessStartInfo psi = new ProcessStartInfo();
            if (File.Exists(edge))
            {
                psi.FileName = edge;
                psi.Arguments = "--app=\"" + url + "\" --new-window";
            }
            else if (File.Exists(chrome))
            {
                psi.FileName = chrome;
                psi.Arguments = "--app=\"" + url + "\" --new-window";
            }
            else
            {
                psi.FileName = url;
                psi.UseShellExecute = true;
            }

            try
            {
                Process.Start(psi);
            }
            catch (Exception ex)
            {
                MessageBox.Show("Could not launch MANANTI: " + ex.Message, "MANANTI", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        static void CreateShortcut(string shortcutPath, string targetPath, string description)
        {
            try
            {
                Type shellType = Type.GetTypeFromProgID("WScript.Shell");
                if (shellType != null)
                {
                    dynamic shell = Activator.CreateInstance(shellType);
                    dynamic shortcut = shell.CreateShortcut(shortcutPath);
                    shortcut.TargetPath = targetPath;
                    shortcut.WorkingDirectory = Path.GetDirectoryName(targetPath);
                    shortcut.Description = description;
                    shortcut.IconLocation = targetPath + ",0";
                    shortcut.Save();
                }
            }
            catch { }
        }
    }
}
