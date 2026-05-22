import os
import re

files_to_refactor = [
    'src/pages/public/Landing.tsx',
    'src/pages/public/About.tsx',
    'src/pages/public/Pricing.tsx'
]

for filename in files_to_refactor:
    with open(filename, 'r') as f:
        content = f.read()

    # 1. Add imports
    if 'PublicNavbar' not in content:
        content = re.sub(r'(import React.*?\n)', r'\1import PublicNavbar from "../../components/shared/Navbar/PublicNavbar"\nimport PublicFooter from "../../components/shared/Footer/PublicFooter"\n', content, count=1)

    # 2. Remove states and variables
    content = re.sub(r'\s*const \[isMobileMenuOpen, setIsMobileMenuOpen\] = useState\(false\)', '', content)
    content = re.sub(r'\s*const handleLoginClick = \(\) => navigate\(\'/login\'\)', '', content)
    content = re.sub(r'\s*const navLinks = \[\s*\{[^\}]*\},\s*\{[^\}]*\},\s*\{[^\}]*\},\s*\{[^\}]*\},\s*\]', '', content)
    
    # 3. Replace Navbar
    # This regex looks for {/* ===================== TOP NAV BAR ===================== */}
    # down to the end of {/* ===================== MOBILE MENU OVERLAY ===================== */}
    # and its trailing }
    content = re.sub(r'\{\/\*\s*={21}\s*TOP NAV BAR\s*={21}\s*\*\/\}.*?\{\/\*\s*={21}\s*MOBILE MENU OVERLAY\s*={21}\s*\*\/\}.*?\}\)', '<PublicNavbar />', content, flags=re.DOTALL)

    # 4. Replace Footer
    content = re.sub(r'\{\/\*\s*={21}\s*FOOTER\s*={21}\s*\*\/\}.*?<\/Box>\s*<\/Box>\s*\)\s*\}\s*export default', '<PublicFooter />\n    </Box>\n  )\n}\n\nexport default', content, flags=re.DOTALL)

    with open(filename, 'w') as f:
        f.write(content)

print("Refactoring complete.")
