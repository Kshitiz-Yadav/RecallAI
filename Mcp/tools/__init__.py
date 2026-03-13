import importlib
import pkgutil
from pathlib import Path

def register_all_tools(mcp):
    package_dir = Path(__file__).parent
    for module_info in pkgutil.iter_modules([str(package_dir)]):
        module = importlib.import_module(f"tools.{module_info.name}")
        if hasattr(module, "register_tools"):
            module.register_tools(mcp)