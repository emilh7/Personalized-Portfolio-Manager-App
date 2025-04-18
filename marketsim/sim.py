import random

# @TODO: this is going to be rewritten very heavily

def truncate(flt, sig):

    trunc = f"{flt:.{sig}f}"
    return (float(trunc))

def update(val):

    change = float(random.randint(1,25)) / 1000
    change = truncate(change, 5)

    polarity = random.randint(0,1)

    if not polarity:
        change *= -1.0

    val *= (1 + change)
    val = truncate(val, 1)

    print(val)

    return val
