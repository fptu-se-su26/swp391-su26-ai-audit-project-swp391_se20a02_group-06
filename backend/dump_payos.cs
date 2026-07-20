using System;
using System.Reflection;
using System.Linq;

class Program {
    static void Main() {
        var asm = Assembly.LoadFrom(@"C:\Users\Minami\.nuget\packages\payos\2.1.0\lib\net9.0\PayOS.dll");
        foreach (var type in asm.GetTypes().Where(t => t.IsPublic)) {
            Console.WriteLine(type.FullName);
            foreach (var method in type.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly)) {
                Console.WriteLine("  " + method.Name);
            }
        }
    }
}
