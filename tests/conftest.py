import subprocess
import time
import pytest
import requests

@pytest.fixture(scope="session")
def local_server():
    # Start the server using python's built-in http.server
    port = 8001
    process = subprocess.Popen(
        ["python3", "-m", "http.server", str(port)],
        cwd="kids-keyboard",
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    
    # Wait for server to be ready
    base_url = f"http://localhost:{port}"
    timeout = 10
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            response = requests.get(base_url)
            if response.status_code == 200:
                break
        except requests.exceptions.ConnectionError:
            pass
        time.sleep(0.5)
    else:
        process.terminate()
        pytest.fail(f"Server at {base_url} failed to start within {timeout} seconds")
        
    yield base_url
    
    # Shutdown the server
    process.terminate()
    process.wait()
